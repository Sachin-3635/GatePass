import { ILocationMaster } from "../INTERFACE/LocationMaster";
import { IGatepassProps } from "../../components/IGatepassProps";
import SPCRUDOPS from "../DAL/spcrudops";

export default function Location() {
  const getLocationdata = async (
    filter: string,
    sorting: { column: string; isAscending: boolean },
    props: IGatepassProps
  ): Promise<ILocationMaster[]> => {
    try {
      const sp = await SPCRUDOPS(); 

      const results = await sp.getData(
        "CityMaster",
        "Id,City",
        "",
        filter,
        sorting,
        props
      );

      return results.map((item: any): ILocationMaster => ({
        Id: item.Id,   
        City: item.City ?? "",
        
      }));
    } catch (error) {
      console.error("Error fetching request data:", error);
      return [];
    }
  };

  return {
    getLocationdata,
  };
}