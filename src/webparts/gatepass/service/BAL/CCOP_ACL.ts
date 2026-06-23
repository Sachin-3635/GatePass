import { ICCOPACL } from "../INTERFACE/ICCOPACL";

import { IGatepassProps } from "../../components/IGatepassProps";
import SPCRUDOPS from "../DAL/spcrudops";

export interface ICOOPACLOps {
    getCOOPACLDataFilterByEmail(strFilter: string, sorting: any, props: ICCOPACL): Promise<ICCOPACL>;
}
export default function COOPACLOps() {
    const spCrudOps = SPCRUDOPS();



const getCOOPACLDataFilterByEmail = async (sorting: any, props: IGatepassProps, filter: string): Promise<ICCOPACL[]> => {
    const results = await (await spCrudOps).getData("CCOP_ACL",
        "*,UserName/Id,UserName/Title,UserName/EMail"
        ,"UserName"
        ,""
        , { column: 'Order0', isAscending: true }
        , props

        
    );

    return results.map((item: any): ICCOPACL => ({
        ID: item.ID,
        Title: item.Title,
        Role:item.Role,
        UserName: item?.UserName,
        }));
};

    return {
         getCOOPACLDataFilterByEmail
    };
}