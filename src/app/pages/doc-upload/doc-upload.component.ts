import { Component } from '@angular/core';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})
export class DocUploadComponent {
  uploadedFiles: File[] = [];
  filePreviews: { data: string | ArrayBuffer | null; name: string; type: string }[] = [];
  maxFileSize = 300 * 1024; // 300KB

  // Drag Over
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.add('dragging');
  }

  //Drag Leave
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.remove('dragging');
  }

  //Remove the drag
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

  // Select file 
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.handleFiles(files);
    }
  }

  // Function to handle files uploaded by the user
  private handleFiles(files: File[]) {
    // Add the uploaded files to the uploadedFiles array
    this.uploadedFiles = [...this.uploadedFiles, ...files];
    // Loop through each file
    files.forEach((file) => {
      // Checking uploaded files are larger than 300KB
      if(file.size > this.maxFileSize){
        // Alert the user if the file exceeds the maximum file size limit
        alert(`${file.name} exceeds the maximum file size limit of 300KB.`);
        return;
      }
      // Create a new FileReader object
      const fileReader = new FileReader();
      // Set the onload event handler
      fileReader.onload = () => {
        // Check if the file is an image
        const isImage = file.type.startsWith('image/');
        // Get the file data
        const data = fileReader.result;
        // Push the file data to the filePreviews array
        this.filePreviews.push({
          data,
          name: file.name,
          type: isImage ? 'image' : 'document'
        });
      };
      fileReader.readAsDataURL(file); // Reads file as a base64 data URL
    });
  }

  // Remove files
  removeFile(index: number): void { 
    this.filePreviews.splice(index, 1);  
    this.uploadedFiles.splice(index, 1);
  }
  
//Open Images in a new tab
  openImage(data: string | ArrayBuffer | null): void {
    if (typeof data === 'string') {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Image Preview</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center;">
              <img src="${data}" style="max-width:100%; max-height:100%;"/>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  }
}
