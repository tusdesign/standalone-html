export interface Visitor {
  mobile: string;
  name: string;
  expire: string;
  pass_id: number;
  company: string;
}

export declare enum VisitStatus {
  Draft = 'draft',
  Pending = 'pending',
  Active = 'active',
  Rejected = 'rejected',
  Expired = 'expired',
}

export type Visit = {
  id: number;
  name: string;
  mobile: string;
  created_by: number;
  visitee_id: number;
  department_id: string;
  status: VisitStatus;
  from: string;
  exp: string;
  source: string;
  delegated_payment?: boolean;
  license_plates: string[];
  company: string;
  visitors: Visitor[];
  visitor_id: number;
};
