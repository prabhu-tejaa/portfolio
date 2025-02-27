import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-spotify',
  imports: [],
  templateUrl: './spotify.component.html',
  styleUrl: './spotify.component.scss'
})
export class SpotifyComponent {

  playlistId = '1jVFHSFYsIIBfBN5GLpoye'; // Replace with your Spotify playlist ID
  playlistUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Construct the Spotify embed URL
    const url = `https://open.spotify.com/embed/playlist/${this.playlistId}?utm_source=generator&theme=0`;
    // Sanitize the URL to prevent security issues
    this.playlistUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


}
