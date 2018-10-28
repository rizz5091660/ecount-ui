import { Injectable } from '@angular/core';

@Injectable()
export class SmartTableService {

  data = [{"address":{"street":"Jalan Maju Mundur no 13 Blok A","city":"Tangerang","state":"Banten","zip":"12345","country":"Indonesia"},"name":"PT Sido Muncul","phone":"01133682132","email":"sido.muncul@yahoo.com"},
  {"address":{"street":"Jalan Maju Mundur no 13 Blok A","city":"Tangerang","state":"Banten","zip":"12345","country":"Indonesia"},"name":"PT Sido Muncul","phone":"01133682132","email":"sido.muncul@yahoo.com"},
  {"address":{"street":"Jalan Maju Mundur no 13 Blok A","city":"Tangerang","state":"Banten","zip":"12345","country":"Indonesia"},"name":"PT Sido Muncul","phone":"01133682132","email":"sido.muncul@yahoo.com"},
  {"address":{"street":"Jalan Maju Mundur no 13 Blok A","city":"Tangerang","state":"Banten","zip":"12345","country":"Indonesia"},"name":"PT Sido Muncul","phone":"01133682132","email":"sido.muncul@yahoo.com"},
  {"address":{"street":"Jalan Maju Mundur no 13 Blok A","city":"Tangerang","state":"Banten","zip":"12345","country":"Indonesia"},"name":"PT Sido Muncul","phone":"01133682132","email":"sido.muncul@yahoo.com"},
  {"address":{"street":"Jalan Maju Mundur no 13 Blok A","city":"Tangerang","state":"Banten","zip":"12345","country":"Indonesia"},"name":"PT Sido Muncul","phone":"01133682132","email":"sido.muncul@yahoo.com"}
];

  getData() {
    return this.data;
  }
}
