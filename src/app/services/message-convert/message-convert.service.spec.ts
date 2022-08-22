import { TestBed } from '@angular/core/testing';

import { MessageConvertService } from './message-convert.service';

describe('MessageConvertService', () => {
  let service: MessageConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
