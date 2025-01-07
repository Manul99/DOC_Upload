import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent {
  uploadedFiles: File[] = [];
  filePreviews: { data: string | ArrayBuffer | null; name: string; type: string }[] = [];

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.add('dragging');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.remove('dragging');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.remove('dragging');

    if (event.dataTransfer && event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.handleFiles(files);
    }
  }

  private handleFiles(files: File[]) {
    this.uploadedFiles = [...this.uploadedFiles, ...files];
    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const isImage = file.type.startsWith('image/');
        const data = fileReader.result;
        this.filePreviews.push({
          data,
          name: file.name,
          type: isImage ? 'image' : 'document'
        });
      };
      fileReader.readAsDataURL(file); 
    });
  }
}
