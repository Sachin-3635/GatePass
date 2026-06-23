import { IRequest } from "../INTERFACE/Request";
import { IGatepassProps } from "../../components/IGatepassProps";
import SPCRUDOPS from "../DAL/spcrudops";

export default function Request() {
  const getRequestdata = async (
    filter: string,
    sorting: { column: string; isAscending: boolean },
    props: IGatepassProps
  ): Promise<IRequest[]> => {
    try {
      const sp = await SPCRUDOPS(); 

      const results = await sp.getData(
        "EmployeeMaster",
        "Id,Title,EmployeeName,Employee/Id,Employee/Title,Department,Status,ReportingManager/Id,ReportingManager/Title",
        "ReportingManager,Employee",
        filter,
        sorting,
        props
      );

      return results.map((item: any): IRequest => ({
        Id: item.Id,
        Title: item.Title,
        EmployeeName: item.EmployeeName ?? "",
        Department: item.Department ?? "",
        Status: item.Status ?? "",
        ReportingManager: item.ReportingManager?.Title ?? "",
                ReportingManagerId: item.ReportingManager?.Id ?? "",
                EmployeeId: item.Employee?.Id ?? "",
               
                

      }));
    } catch (error) {
      console.error("Error fetching request data:", error);
      return [];
    }
  };

  return {
    getRequestdata,
  };
}