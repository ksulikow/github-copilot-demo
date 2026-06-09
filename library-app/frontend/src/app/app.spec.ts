import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { LibraryApiService } from './library-api.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: LibraryApiService,
          useValue: {
            getBooks: () => of({ page: 1, pageSize: 20, total: 0, data: [] }),
            listLoans: () => of([]),
            createBook: () => of(null),
            updateBook: () => of(null),
            deleteBook: () => of(undefined),
            borrowBook: () => of(null),
            returnLoan: () => of(null),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Books and Circulation');
  });
});
