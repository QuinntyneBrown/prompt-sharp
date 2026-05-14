import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  PromptSharpAdminMediaApi,
  PromptSharpAdminUsersApi,
  PromptSharpTutorialsApi,
  providePromptSharpApi,
} from './api';

describe('PromptSharp API services', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        providePromptSharpApi({
          baseUrl: 'https://backend.test',
          accessToken: () => 'test-token',
        }),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('builds public tutorial catalog requests with filters', () => {
    const api = TestBed.inject(PromptSharpTutorialsApi);

    api
      .list({
        category: 'dotnet',
        difficulty: 'intermediate',
        page: 2,
        pageSize: 10,
        sort: 'updated',
      })
      .subscribe();

    const request = http.expectOne((candidate) => {
      return (
        candidate.method === 'GET' &&
        candidate.url === 'https://backend.test/api/v1/tutorials' &&
        candidate.params.get('category') === 'dotnet' &&
        candidate.params.get('difficulty') === 'intermediate' &&
        candidate.params.get('page') === '2' &&
        candidate.params.get('pageSize') === '10' &&
        candidate.params.get('sort') === 'updated'
      );
    });

    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({ items: [], page: 2, pageSize: 10, totalCount: 0 });
  });

  it('updates admin user roles against the backend contract', () => {
    const api = TestBed.inject(PromptSharpAdminUsersApi);

    api.updateRoles('user-id', { roles: ['Admin', 'Editor'] }).subscribe();

    const request = http.expectOne('https://backend.test/api/v1/admin/users/user-id/roles');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ roles: ['Admin', 'Editor'] });
    request.flush({
      id: 'user-id',
      sub: 'subject',
      email: 'admin@example.com',
      displayName: 'Admin User',
      avatarUrl: null,
      createdAt: '2026-05-14T00:00:00Z',
      lastSeenAt: '2026-05-14T00:00:00Z',
      roles: ['Admin', 'Editor'],
    });
  });

  it('uploads admin media as multipart form data', () => {
    const api = TestBed.inject(PromptSharpAdminMediaApi);
    const file = new Blob(['<svg></svg>'], { type: 'image/svg+xml' });

    api.upload(file, 'diagram.svg').subscribe();

    const request = http.expectOne('https://backend.test/api/v1/admin/media');
    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBe(true);
    request.flush({
      id: 'media-id',
      url: '/media/diagram.svg',
      fileName: 'diagram.svg',
      contentType: 'image/svg+xml',
      sizeBytes: 11,
      uploadedById: 'user-id',
      uploadedAt: '2026-05-14T00:00:00Z',
    });
  });
});
