import { ILocationMaster } from "../INTERFACE/LocationMaster";
import { IGatepassProps } from "../../components/IGatepassProps";
import SPCRUDOPS from "../DAL/spcrudops";
import { IApproverMatrics } from "../INTERFACE/ApproverMatrics";

export default function ApproverMatrics() {
  const getApproverdata = async (
    filter: string,
    sorting: { column: string; isAscending: boolean },
    props: IGatepassProps
  ): Promise<IApproverMatrics[]> => {
    try {
      const sp = await SPCRUDOPS(); 

      const results = await sp.getData(
        "ApproveMatrics",
        "Id,CurrentApprover/Id,CurrentApprover/Title,Role,Status,Level",
        "CurrentApprover",
        filter,
        sorting,
        props
      );

 return results.map((item: any): IApproverMatrics => ({
  Id: item.Id,
  CurrentApproverId: item.CurrentApprover?.Id ?? 0,
  CurrentApproverTitle: item.CurrentApprover?.Title ?? "",
  Role: item.Role ?? "",
  Status: item.Status ?? "",
  Level: item.Level ?? "",
}));
    } catch (error) {
      console.error("Error fetching request data:", error);
      return [];
    }
  };

  return {
    getApproverdata,
  };
}