import SPCRUDOPS from "../DAL/spcrudops";
import { IGatePass } from "../INTERFACE/GatePass";
import { IGatepassProps } from "../../components/IGatepassProps";

const LIST_NAME = "GatePass";

export default function GatePass() {
  const saveRequest = async (
    data: IGatePass,
    props: IGatepassProps
  ) => {
    const dal = await SPCRUDOPS();

    return await dal.insertData(LIST_NAME, data, props);
  };
// const getRequests = async (props: IGatepassProps) => {
//   const dal = await SPCRUDOPS();

//   return await dal.getData(
//     LIST_NAME,
//     "Id,EmployeeName,NoItems,NoBox,Status,Address,Created,GatePassReturnable,VendorName/VendorName,VendorName/Id,City/City,City/Id,UOM,Department,ReportingManagerId,Remarks",
//     "VendorName,City",
//     "",
//     { column: "Id", isAscending: false },
//     props
//   );
// };
// const getRequests = async (props: IGatepassProps) => {
//   const dal = await SPCRUDOPS();

//   const currentUserEmail = props.currentSPContext.pageContext.user.email;

//   return await dal.getData(
//     LIST_NAME,
//     "Id,EmployeeName,NoItems,NoBox,Status,Address,Created,GatePassReturnable,VendorName/VendorName,VendorName/Id,City/City,City/Id,UOM,Department,ReportingManagerId,Remarks,Author/EMail",
//     "VendorName,City,Author",
//     `Author/EMail eq '${currentUserEmail}'`,
//     { column: "Id", isAscending: false },
//     props
//   );
// };

const getRequests = async (props: IGatepassProps) => {
  const dal = await SPCRUDOPS();

  return await dal.getData(
    "GatePass",
    "Id,EmployeeName,NoItems,NoBox,Status,Address,Created,CurrentApprover/Id,CurrentApprover/Title,GatePassReturnable,VendorName/VendorName,VendorName/Id,City/City,City/Id,UOM,Department,ReportingManager/Id,ReportingManager/Title,Author/Id,Author/EMail,Remarks,WFH,ApproverMatrics",
    "VendorName,City,Author,ReportingManager,CurrentApprover",
    "",
    { column: "Id", isAscending: false },
    props
  );
};

const getRequestById = async (id: number, props: IGatepassProps) => {
  const dal = await SPCRUDOPS();

  return await dal.getData(
    LIST_NAME,
    "Id,CurrentApprover/Id,CurrentApprover/Title,EmployeeName,NoItems,NoBox,Status,Created,Address,GatePassReturnable,VendorName/VendorName,VendorName/Id,City/City,City/Id,UOM,Department,ReportingManager/Id,ReportingManager/Title,Remarks,WFH,ApproverMatrics",
    "VendorName,City,ReportingManager,CurrentApprover",
    `Id eq ${id}`,
    { column: "Id", isAscending: false },
    props
  );
};
const updateRequest = async (
  id: number,
  data: any,
  props: IGatepassProps
) => {
  const dal = await SPCRUDOPS();

  return await dal.updateData(LIST_NAME, id, data, props);
};

  return {
    saveRequest,
    getRequests,
    getRequestById,
    updateRequest
  };
}