/* tslint:disable */

export interface Query {
  retailers: Array<Retailer> | null;
  answer: Array<number>;
}

export interface Retailer {
  id: number | null;
  retailerNumber: number | null;
  name: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  retailerTypeId: number | null;
  sellsPokerLotto: boolean | null;
  acceptsCreditOrDebit: boolean | null;
}
