import { IVendor } from "../INTERFACE/Vendor";
import { IGatepassProps } from "../../components/IGatepassProps";
import SPCRUDOPS from "../DAL/spcrudops";

export default function Vendor() {
const getVendordata = async (
  filter: string,
  sorting: { column: string; isAscending: boolean },
  props: IGatepassProps
): Promise<IVendor[]> => {
  try {
    const sp = await SPCRUDOPS();

    const filterQuery = filter
      ? `${filter} and Status eq 'Active'`
      : `Status eq 'Active'`;

    const results = await sp.getData(
      "VendorList",
      "Id,VendorName,Address",
      "",
      filterQuery,
      sorting,
      props
    );

    return results.map((item: any): IVendor => ({
      Id: item.Id,
      VendorName: item.VendorName ?? "",
      Address: item.Address ?? "",
    }));
  } catch (error) {
    console.error("Error fetching request data:", error);
    return [];
  }
};

  return {
    getVendordata,
  };
}