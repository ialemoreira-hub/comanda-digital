import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoConfirmado } from './pedido-confirmado';

describe('PedidoConfirmado', () => {
  let component: PedidoConfirmado;
  let fixture: ComponentFixture<PedidoConfirmado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoConfirmado],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoConfirmado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
