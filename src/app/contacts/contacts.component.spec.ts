// Déclarations globales pour contourner TS2593 et TS2304 sans modifier tsconfig.spec.json
declare function describe(description: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function it(expectation: string, assertion: () => void): void;
declare function expect(actual: any): { toBeTruthy(): void };

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule],
      declarations: [ContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});