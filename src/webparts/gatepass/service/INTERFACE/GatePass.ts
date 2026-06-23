// export interface IGatePass {
//   Id?: number;
//   WFH: string;
//   CurrentApprover: string;
//   ApproverMatrics: string;
// //   Status: string;
//   EmployeeName: string;
//   Department: string;
//   ReportingManagerId: string;
//   VendorNameId: number;
//   Address: string;
//   City: string;
// }
export interface IGatePass {
  Id?: number;

  EmployeeName: string;
  Department: string;
  ReportingManager?: string; 
  VendorNameId: number;
  Address: string;
  CityId: number;
 ReportingManagerId: number;
  //WFH: string;
  //CurrentApprover: string;
  //ApproverMetrics: string;

  Status: string;

  NoItems: number;
  UOM: string;
  NoBox: number;
  GatePassReturnable: string;
  Remarks?: string;
  CurrentApproverId:any; 
   WFH?: string; 
   ApproverMatrics?:string;

  //ItemsJson?: string; // optional but recommended
}