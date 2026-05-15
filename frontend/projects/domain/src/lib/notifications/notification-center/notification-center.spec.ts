import { TestBed } from '@angular/core/testing';
import { NotificationCenter } from './notification-center';

describe('NotificationCenter', () => {
  it('pushes and dismisses messages', () => {
    const center = TestBed.inject(NotificationCenter);
    center.push({ id: '1', tone: 'info', text: 'hello' });
    expect(center.messages().length).toBe(1);
    center.dismiss('1');
    expect(center.messages().length).toBe(0);
  });
});
