import * as React from "react";
import { useParams, useHistory } from "react-router-dom";
import GatePass from "../../service/BAL/GatePass";
import AuthorisedSignatories from "../../service/BAL/AuthorisedSignatories";
import type { IGatepassProps } from "../IGatepassProps";
import "../Pages/Css/NewRequest.scss";
import SPCRUDOPS from "../../service/DAL/spcrudops";
import logo from "../../assets/nbclatest.png";
import 'bootstrap/dist/css/bootstrap.min.css';
interface IApproverDetails {
  Id: number;
  Name: string;
  Role: string;
  Level: number;
  Status: string;
}

const ViewForm: React.FC<IGatepassProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = React.useState<any[]>([]);

  const history = useHistory();

  const [request, setRequest] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<any[]>([]);

  const [approverDetails, setApproverDetails] = React.useState<IApproverDetails[]>([]);

  const loadData = async () => {
    try {
      const gateService = GatePass();
      const authService = AuthorisedSignatories();

      const res = await gateService.getRequestById(Number(id), props);
      const record = res?.[0];

      setRequest(record);

      const authItems = await authService.getAuthorisedByGatePassId(Number(id), props);
      setItems(authItems);

      if (record?.ApproverMatrics) {
        try {
          const parseddata = JSON.parse(record?.ApproverMatrics);
          setApproverDetails(Array.isArray(parseddata) ? parseddata : [parseddata])
        } catch (e) {
          console.error("ApproverMatrix parse error:", e);
          setApproverDetails([]);
        }
      }
      if (record?.WFH) {
        try {
          const parsed = JSON.parse(record.WFH);
          setWorkflow(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (e) {
          console.error("WFH parse error:", e);
          setWorkflow([]);
        }
      } else {
        setWorkflow([]);
      }

      const sp = await SPCRUDOPS();

      const docs = await sp.getData(
        "SupportingDocs",
        "Id,FileLeafRef,FileRef,GatePassID",
        "",
        `GatePassID eq '${id}'`,
        { column: "Id", isAscending: false },
        props,
      );

      console.log("Supporting Docs:", docs);

      setUploadedFiles(Array.isArray(docs) ? docs : []);

    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (id) loadData();
  }, [id]);

  return (
    <div className='MainUplodForm' style={{ margin: "5px 0px" }}>
      <div className='row'>
        <div className='col-md-12'>
          <div className='Main-Boxpoup'>
            <div className="bordered">
              <a><img src={logo} /></a>
              <h1>View Form</h1>
            </div>
            <div className="approval-ribbon">
              <div className="ribbon-step approved">{"Initiator"}</div>
              {approverDetails.map((step, index) => {
                let className = "waiting";

                if (step.Status === "initiator") className = "initiator";
                if (step.Status === "Approved") className = "approved";
                if (step.Status === "current") className = "current";

                return (
                  <div key={index} className={`ribbon-step ${className}`}>
                    {step.Name}
                  </div>
                );
              })}
            </div>
            <div className='borderedbox'>
              <div className="heading1">
                <label>Requestor Information</label>
              </div>
              <div className='main-formcontainer'>
                <div className='row mb-20'>
                  <div className='col-md-4'>
                    <label className='font'>Request By</label>
                    <input type="text" className="form-control textfield" value={request?.EmployeeName || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font'>Department </label>
                    <input type="text" className="form-control textfield" value={request?.Department || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font'>Reporting Manager </label>
                    <input type="text" className="form-control textfield" value={request?.ReportingManager?.Title} />
                  </div>
                </div>
                <div className='row mb-20'>
                  <div className='col-md-4'>
                    <label className='font'>Name of Vendor <span className='Mantorystar'>*</span></label>
                    <input type="text" className="form-control textfield" value={request?.VendorName?.VendorName || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font'>Address of Vendor <span className='Mantorystar'>*</span></label>
                    <input type="text" className="form-control textfield" value={request?.Address || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font'>Location <span className='Mantorystar'>*</span></label>
                    <input type="text" className="form-control textfield" value={request?.City?.City || ""} />
                  </div>
                </div>
                <div className='row mb-20'>
                  <div className='col-md-4'>
                    <label className='font'>No of Items <span className='Mantorystar'>*</span></label>
                    <input type="text" className="form-control textfield" value={request?.NoItems || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font'>UOM </label>
                    <input type="text" className="form-control textfield" value={request?.UOM || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font'>No of Items in box <span className="Mantorystar"></span></label>
                    <input type="text" className="form-control textfield" value={request?.NoBox || ""} />
                  </div>
                </div>
                <div className='row mb-20'>
                  <div className='col-md-4'>
                    <label className='font'>Gatepass is returnable or not ?</label>
                    <input type="text" className="form-control textfield" value={request?.GatePassReturnable || ""} />
                  </div>
                  <div className='col-md-4'>
                    <label className='font' style={{ display: "block" }}>Authorised Signatory <span className="Mantorystar">*</span> </label>
                    <a>Click here to view Authorised Signatories</a>
                  </div>
                  <div className='col-md-4'>
                    <label className='font' style={{ display: "block" }}>Supporting documents </label>
                    {uploadedFiles.length === 0 ? (
                      <span>No attachments</span>
                    ) : (
                      uploadedFiles.map((file) => (
                        <div key={file.Id}>
                          <a
                            href={`${file.FileRef}?web=1`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {file.FileLeafRef}
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className='row mb-20'>
                  <div className='col-md-12'>
                    <div style={{ overflowX: "auto" }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Sr.No</th>
                            <th>Description of Material</th>
                            <th>Quantity</th>
                            <th>Approx Value</th>
                            <th>Probable Date</th>
                            <th>Purpose for Movement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={6}>No Items</td>
                            </tr>
                          ) : (
                            items.map((item, index) => (
                              <tr key={item.Id}>
                                <td>{index + 1}</td>
                                <td>
                                  <input value={item.DescriptionMaterial || ""} readOnly />
                                </td>
                                <td>
                                  <input value={item.Quantity || ""} readOnly />
                                </td>
                                <td>
                                  <input value={item.ApproximateValue || ""} readOnly />
                                </td>
                                {/* <td><input value={item.ProbableDate || ""} readOnly /></td> */}
                                <td>
                                  <input
                                    value={item.ProbableDate
                                      ? new Date(item.ProbableDate).toLocaleDateString()
                                      : ""}
                                    readOnly
                                  />

                                </td>
                                <td>
                                  <input value={item.PurposeMovement || ""} readOnly />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="heading1" style={{ marginTop: "10px" }}>
                <label>Workflow & Comment</label>
              </div>
              <div className='main-formcontainer'>
                <div className='row mb-20'>
                  <div className='col-md-12'>
                    <div style={{ overflowX: "auto" }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Action By</th>
                            <th>Action Taken</th>
                            <th>Date</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workflow.length === 0 ? (
                            <tr>
                              <td colSpan={4}>No Workflow History</td>
                            </tr>
                          ) : (
                            workflow.map((w: any, index: number) => (
                              <tr key={index}>
                                <td>{w.CurrentApprover}</td>
                                <td>{w.ActionTaken}</td>
                                {/* <td>{new Date(w.Date).toLocaleString()}</td> */}
                                <td>{new Date(w.Date).toLocaleDateString()}</td>
                                <td>{w.Comment || "-"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='row mb-20'>
                  <div className='col-md-12'>
                    <label className='font'>Remarks </label>
                    <textarea value={request?.Remarks || ""} className="form-control textfield" />
                  </div>
                </div>
              </div>
              <div className='row mb-20 mt-20'>
                <div className='col-md-12'>
                  <div className="button-container">
                    <button className="Exit-btn" onClick={() => history.push("/")} >
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
