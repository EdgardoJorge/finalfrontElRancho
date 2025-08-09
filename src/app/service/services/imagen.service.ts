import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroments.development';
import { Observable, firstValueFrom } from 'rxjs';
import { Imagen } from '../models/ImagenModel';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  ObjectCannedACL 
} from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private readonly apiUrl = `${environment.backendBaseUrl}/api/Imagen`;
  private readonly s3Client: S3Client;
  private readonly bucketName = environment.s3.bucketName;

  constructor(private readonly http: HttpClient) {
    this.s3Client = new S3Client({
      region: environment.s3.region,
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: environment.s3.region
        },
        identityPoolId: environment.s3.identityPoolId
      }),
      // AGREGADO: Configuración específica para navegador
      forcePathStyle: false,
      useAccelerateEndpoint: false
    });
  }

  getAll(): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(this.apiUrl);
  }

  getByProductId(productId: number): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${this.apiUrl}/producto/${productId}`);
  }

  async create(file: File, productId: number): Promise<Imagen> {
    try {
      console.log('🔧 Iniciando creación de imagen...');
      console.log('📁 Archivo:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type);
      
      // 1. Convertir File a ArrayBuffer para compatibilidad con navegador
      const arrayBuffer = await this.fileToArrayBuffer(file);
      console.log('✅ Archivo convertido a ArrayBuffer');

      // 2. Subir el archivo a S3
      const s3Key = `products/${productId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('📤 Subiendo a S3 con key:', s3Key);
      
      const s3Url = await this.uploadFileToS3(arrayBuffer, s3Key, file.type);
      console.log('✅ Archivo subido a S3:', s3Url);

      // 3. Crear registro en la base de datos
      const nuevaImagen: Imagen = {
        id: 0, // El ID será generado por el backend
        imagenes: s3Url,
        idProductos: productId
      };

      console.log('💾 Guardando registro en BD:', nuevaImagen);
      
      // Usar firstValueFrom en lugar de toPromise() que está deprecado
      const imagenCreada = await firstValueFrom(
        this.http.post<Imagen>(`${this.apiUrl}/crear`, nuevaImagen)
      );

      if (!imagenCreada) {
        throw new Error('No se recibió respuesta del servidor');
      }

      console.log('✅ Imagen creada exitosamente:', imagenCreada);
      return imagenCreada;

    } catch (error: any) {
      console.error('❌ Error al crear imagen:', error);
      
      // Proporcionar más contexto sobre el error
      if (error.name === 'CredentialsProviderError') {
        throw new Error('Error de credenciales AWS. Verifique la configuración de Cognito.');
      } else if (error.name === 'NetworkError' || error.status >= 400) {
        throw new Error('Error de conexión con AWS S3 o backend.');
      } else if (error.message?.includes('readableStream')) {
        throw new Error('Error de compatibilidad del navegador con AWS SDK.');
      }
      
      throw error;
    }
  }

  private async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Error al convertir archivo a ArrayBuffer'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  private async uploadFileToS3(arrayBuffer: ArrayBuffer, key: string, contentType: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: new Uint8Array(arrayBuffer), // Usar Uint8Array en lugar de File
        ContentType: contentType,
      };

      console.log('🚀 Enviando comando PutObject a S3...');
      console.log('📊 Parámetros:', {
        Bucket: params.Bucket,
        Key: params.Key,
        ContentType: params.ContentType,
        BodySize: params.Body.length
      });

      const command = new PutObjectCommand(params);
      const result = await this.s3Client.send(command);
      
      console.log('✅ Respuesta de S3:', result);
      
      const s3Url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      console.log('🔗 URL generada:', s3Url);
      
      return s3Url;

    } catch (error: any) {
      console.error('❌ Error detallado en uploadFileToS3:', error);
      console.error('📋 Stack trace:', error.stack);
      
      if (error.name === 'CredentialsProviderError') {
        throw new Error(`Error de credenciales AWS: ${error.message}`);
      } else if (error.name === 'UnknownEndpoint') {
        throw new Error(`Endpoint de S3 no válido. Verifique la región: ${environment.s3.region}`);
      } else if (error.name === 'AccessDenied') {
        throw new Error('Acceso denegado a S3. Verifique los permisos del Identity Pool.');
      } else if (error.name === 'NoSuchBucket') {
        throw new Error(`El bucket ${this.bucketName} no existe o no es accesible.`);
      }
      
      throw error;
    }
  }

  async delete(imagenId: number, s3Url: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando imagen:', imagenId, s3Url);
      
      // 1. Extraer la clave S3 de la URL
      const s3Key = this.extractS3KeyFromUrl(s3Url);

      // 2. Eliminar de tu API
      await firstValueFrom(this.http.delete(`${this.apiUrl}/${imagenId}`));
      console.log('✅ Imagen eliminada de la BD');

      // 3. Eliminar de S3
      if (s3Key) {
        const deleteParams = {
          Bucket: this.bucketName,
          Key: s3Key
        };
        const command = new DeleteObjectCommand(deleteParams);
        await this.s3Client.send(command);
        console.log('✅ Imagen eliminada de S3');
      }

    } catch (error: any) {
      console.error('❌ Error al eliminar imagen:', error);
      throw error;
    }
  }

  private extractS3KeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === `${this.bucketName}.s3.amazonaws.com`) {
        return urlObj.pathname.substring(1); // Elimina el slash inicial
      }
      return null;
    } catch {
      return null;
    }
  }
}