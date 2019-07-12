import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/app/services/session.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private sessionService: SessionService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadGithubUsername();
  }

  gettingRepositoryList = false;
  gettingRepositoryStats = false;

  loadGithubUsername() {
    if (this.sessionService.token) {
      this.apiService.get('githubUsername', this.sessionService.token)
        .subscribe(
          response => {
            if (response.success) {
              this.githubUsername = response.data ? response.data : '';
              this.usernameChanged();
            } else {
              console.error(response.data);
            }
          },
          error => {
            console.error(error);
          }
        )
    } else {
      var loadedGithubUsername = localStorage.getItem('githubUsername');
      this.githubUsername = loadedGithubUsername ? loadedGithubUsername.trim() : '';
      this.usernameChanged();
    }
  }

  saveGithubUsername() {
    if (this.sessionService.token) {
      this.apiService.put('githubUsername', this.sessionService.token, {githubUsername: this.githubUsername.trim()})
        .subscribe(
          response => {
            if (response.success) {
              console.log('githubUsername has been saved to server');
            } else {
              console.error(response.data);
            }
          },
          error => {
            console.error(error);
          }
        )
    } else {
      localStorage.setItem('githubUsername', this.githubUsername.trim());
    }
  }

  githubUsername = "";
  usernameChanged(): void {
    if (this.githubUsername) {
      this.saveGithubUsername();
      this.gettingRepositoryStats = true;
      this.httpClient.get<object[]>(`https://api.github.com/users/${this.githubUsername.trim()}/repos`)
        .subscribe(
          response => {
            this.currentUserRepo = response;
          },
          error => {
            // alert('Username not found');
          },
          () => {
            this.gettingRepositoryList = false;
          });
    }
  }

  repoFilter = '';
  filter(repoList: object[]): object[] {
    if (this.repoFilter) {
      var filter = this.repoFilter.toLowerCase();
      return repoList.filter(repo => repo['name'].toLowerCase().indexOf(filter) !== -1);
    } else {
      return repoList;
    }
  }

  repoInfo: object = {};
  getRepoInfo(repo: string): void {
    this.gettingRepositoryStats = true;
    this.httpClient.get<object[]>(`https://api.github.com/repos/${this.githubUsername.trim()}/${repo}/releases`)
      .subscribe(
        response => {
          this.currentRepoReleases = response;
          var repoTotalDownloadCount = 0;
          for (let releaseIndex = 0; releaseIndex < this.currentRepoReleases.length; releaseIndex++) {
            if (this.currentRepoReleases[releaseIndex]['assets'].length) {
              var releaseDownloadCount = 0;
              for (let asset of this.currentRepoReleases[releaseIndex]['assets']) {
                releaseDownloadCount += asset['download_count'];
              }
              this.currentRepoReleases[releaseIndex]['download_count'] = releaseDownloadCount;
              repoTotalDownloadCount += releaseDownloadCount;
            }
          }
          this.currentRepoDownloadCount = repoTotalDownloadCount;
        },
        error => {
          alert(error);
        },
        () => {
          this.gettingRepositoryStats = false;
        });

  }

  currentUserRepo: object[] = [];
  currentRepoReleases: object[] = [];
  currentRepoDownloadCount = 0;



}
