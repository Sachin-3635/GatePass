import SPCRUDOPS from "../DAL/spcrudops";
import { IGatepassProps } from "../../components/IGatepassProps";

const LIST_NAME = "AuthorisedSignatories";

export default function AuthorisedSignatories() {
  const saveItem = async (data: any, props: IGatepassProps) => {
    const dal = await SPCRUDOPS();
    return await dal.insertData(LIST_NAME, data, props);
  };
  const getAuthorised = async (props: IGatepassProps) => {
    const dal = await SPCRUDOPS();
  
    return await dal.getData(
      LIST_NAME,
      "Id,GatePassID/Id,DescriptionMaterial,Quantity,ApproximateValue,ProbableDate,PurposeMovement,Status",
      "GatePassID",
      "",
      { column: "Id", isAscending: false },
      props
    );
  };
const getAuthorisedByGatePassId = async (gatePassId: number, props: IGatepassProps) => {
  const dal = await SPCRUDOPS();

  return await dal.getData(
    LIST_NAME,
    "Id,GatePassID/Id,DescriptionMaterial,Quantity,ApproximateValue,ProbableDate,PurposeMovement,Status",
    "GatePassID",
    `GatePassID/Id eq ${gatePassId}`,
    { column: "Id", isAscending: false },
    props
  );
};
const updateItem = async (
  data: any,
  props: IGatepassProps
) => {
  const dal = await SPCRUDOPS();

  return await dal.updateData(
    "AuthorisedSignatories",   
    data.Id,
    data,
    props
  );
};
const deleteItem = async (id: number, props: IGatepassProps) => {
  const dal = await SPCRUDOPS();
  return await dal.deleteData("AuthorisedSignatories", id, props);
};
  return {
    saveItem,
    getAuthorised,
    getAuthorisedByGatePassId,
    updateItem,
    deleteItem
  };
}