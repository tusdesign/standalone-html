declare interface Visitor {
  mobile: string;
  name: string;
  expire?: string;
  pass_id?: number;
  company?: string;
}

declare enum VisitStatus {
  Draft = 'draft',
  Pending = 'pending',
  Active = 'active',
  Rejected = 'rejected',
  Expired = 'expired',
}

declare type Visit = {
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

declare type Passport = {
  CreatedAt: string;
  DeletedAt: string;
  ID: number;
  UpdatedAt: string;
  company: string;
  from: string;
  mobile: string;
  name: string;
  pass_id: number;
  to: string;
  token: string;
  visit_id: number;
  visitor_id: string;
};
