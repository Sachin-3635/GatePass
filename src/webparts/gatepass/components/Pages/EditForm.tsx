import * as React from "react";
import { useParams, useHistory } from "react-router-dom";

import GatePass from "../../service/BAL/GatePass";
import AuthorisedSignatories from "../../service/BAL/AuthorisedSignatories";
import Vendor from "../../service/BAL/Vendor";
import Location from "../../service/BAL/LocationMaster";

import type { IGatepassProps } from "../IGatepassProps";
import "../Pages/Css/NewRequest.scss";

const EditForm: React.FC<IGatepassProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
const [workflow, setWorkflow] = React.useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [header, setHeader] = React.useState<any>({
    EmployeeName: "",
    department: "",
    reportingManager: "",
    reportingManagerId: 0,
  });

  const [items, setItems] = React.useState<any[]>([]);
  const [vendors, setVendors] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([]);
const [request, setRequest] = React.useState<any>(null);
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState("");

  const [noOfItems, setNoOfItems] = React.useState("");
  const [itemsPerBox, setItemsPerBox] = React.useState("");
  const [uom, setUom] = React.useState("");
  const [returnable, setReturnable] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  
const generateRows = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    sr: i + 1,
    description: "",
    quantity: "",
    approx: "",
    date: "",
    purpose: "",
  }));
};
  const loadMasters = async () => {
    const vendorService = Vendor();
    const locationService = Location();

    const v = await vendorService.getVendordata(
      "",
      { column: "Id", isAscending: true },
      props,
    );

    const l = await locationService.getLocationdata(
      "",
      { column: "Id", isAscending: true },
      props,
    );

    setVendors(v);
    setLocations(l);
  };


  const loadData = async () => {
    if (!id) return;
    

    const gateService = GatePass();
    const authService = AuthorisedSignatories();

    const res = await gateService.getRequestById(Number(id), props);
    const main = res?.[0];

    if (main) {
      // setHeader({
      //   EmployeeName: main.EmployeeName || "",
      //   department: main.Department || "",
      //   reportingManager: main.ReportingManager?.Title || "",
      //   reportingManagerId: main.ReportingManagerId || 0,
        
      // });
setHeader({
  EmployeeName: main.EmployeeName || "",
  department: main.Department || "",
  reportingManager: main.ReportingManager?.Title || "",

  reportingManagerId:
    main.ReportingManagerId ||
    main.ReportingManager?.Id ||
    0,
});
      setSelectedVendor(String(main.VendorName?.Id || ""));
      setSelectedLocation(String(main.City?.Id || ""));
      setNoOfItems(String(main.NoItems || ""));
      setItemsPerBox(String(main.NoBox || ""));
      setUom(main.UOM || "");
      setReturnable(main.GatePassReturnable || "");
      setRemarks(main.Remarks || "");
    }
     setRequest(main);
      if (main.WFH) {
    try {
      const parsed = JSON.parse(main.WFH);
      setWorkflow(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (e) {
      console.error("WFH parse error:", e);
      setWorkflow([]);
    }
  }

    const child = await authService.getAuthorisedByGatePassId(
      Number(id),
      props,
    );

    const formatted = child.map((x: any ,index: number) => ({
      sr: index + 1,
      description: x.DescriptionMaterial || "",
      quantity: x.Quantity || "",
      approx: x.ApproximateValue || "",
      date: x.ProbableDate ? new Date(x.ProbableDate).toISOString().split("T")[0] : "",
        purpose: x.PurposeMovement || "",
    }));

    setItems(formatted);
  };
    const addRow = () => {
    setItems([
      ...items,
      {
        sr: items.length + 1,
        description: "",
        quantity: "",
        approx: "",
        date: "",
        purpose: "",
      },
    ]);
  };
    const removeRow = (index: number) => {
    const data = [...items];

    data.splice(index, 1);

    setItems(data);
  };



    // const handleUpdate = async () => {
    //   try {
    //     if (!id) return;

    //     const gateService = GatePass();
    //     const childService = AuthorisedSignatories();

    //     const vendorAddress =
    //       vendors.find((v) => v.Id === Number(selectedVendor))?.Address || "";

        
    //     const payload = {
    //       EmployeeName: header.EmployeeName,
    //       Department: header.department,
    //       ReportingManagerId: header.reportingManagerId,
    //       VendorNameId: Number(selectedVendor),
    //       Address: vendorAddress,
    //       CityId: Number(selectedLocation),
    //       NoItems: Number(noOfItems),
    //       UOM: uom,
    //       NoBox: Number(itemsPerBox),
    //       GatePassReturnable: returnable,
    //       Remarks: remarks,
    //       Status: "Pending For Approver",
    //     };

    //     await gateService.updateRequest(Number(id), payload, props);

       
    //     const oldItems = await childService.getAuthorisedByGatePassId(
    //       Number(id),
    //       props
    //     );

    //     for (const item of oldItems) {
    //       await childService.deleteItem(item.Id, props);
    //     }

       
    //     for (const item of items) {
    //       await childService.saveItem(
    //         {
    //           GatePassIDId: Number(id),
    //           DescriptionMaterial: item.description,
    //           Quantity: Number(item.quantity),
    //           ApproximateValue: item.approx,
    //           ProbableDate: item.date || null,
    //           PurposeMovement: item.purpose,
    //         },
    //         props
    //       );
    //     }

    //     alert("Updated successfully!");
    //     history.push("/RequesterDashboard");
    //   } catch (err) {
    //     console.error(err);
    //     alert("Update failed");
    //   }
    // };

    const handleUpdate = async () => {
      if (isSubmitting) return;
  try {
    if (!id) return;

   
    if (!selectedVendor) {
      alert("Please select Vendor");
      return;
    }

    const vendorAddress =
      vendors.find((v) => v.Id === Number(selectedVendor))?.Address;

    if (!vendorAddress) {
      alert("Vendor address missing");
      return;
    }

    if (!selectedLocation) {
      alert("Please select Location");
      return;
    }

    if (!noOfItems || Number(noOfItems) <= 0) {
      alert("Please enter No of Items");
      return;
    }
       if (!uom) {
  alert("Please select UOM");
  return;
}

    if (!itemsPerBox || Number(itemsPerBox) <= 0) {
      alert("Please enter No of Items in Box");
      return;
    }

    if (!returnable) {
  alert("Please select Gatepass Returnable option");
  return;
}


   
    if (items.length !== Number(noOfItems)) {
      alert("No of Items does not match added rows");
      return;
    }

   
    for (let i = 0; i < items.length; i++) {
      const row = items[i];

      if (
        !row.description ||
        !row.quantity ||
        !row.approx ||
        !row.date ||
        !row.purpose
      ) {
        alert(`Please fill all fields in row ${i + 1}`);
        return;
      }
    }
    const existingWFH = request?.WFH
      ? JSON.parse(request.WFH)
      : [];

    const updatedWFH = [
      ...existingWFH,
      {
        CurrentApprover: header.reportingManager,
        ActionTaken: "Submitted",
        Date: new Date().toISOString(),
        CurrentStatus: "Submitted",
        Comment: remarks,
      },
    ];
    setIsSubmitting(true);

    
    const gateService = GatePass();
    const childService = AuthorisedSignatories();

    const payload = {
      EmployeeName: header.EmployeeName,
      Department: header.department,
      ReportingManagerId: header.reportingManagerId,
      VendorNameId: Number(selectedVendor),
      Address: vendorAddress,
      CityId: Number(selectedLocation),
      NoItems: Number(noOfItems),
      UOM: uom,
      NoBox: Number(itemsPerBox),
      GatePassReturnable: returnable,
      Remarks: remarks,
      Status: "Pending For Approver",
      WFH: JSON.stringify(updatedWFH)
    };

    await gateService.updateRequest(Number(id), payload, props);

   
    const oldItems = await childService.getAuthorisedByGatePassId(
      Number(id),
      props
    );

    for (const item of oldItems) {
      await childService.deleteItem(item.Id, props);
    }

    
    for (const item of items) {
      await childService.saveItem(
        {
          GatePassIDId: Number(id),
          DescriptionMaterial: item.description,
          Quantity: Number(item.quantity),
          ApproximateValue: item.approx,
          ProbableDate: item.date || null,
          PurposeMovement: item.purpose,
        },
        props
      );
    }

    alert("Updated successfully!");
    history.push("/RequesterDashboard");
  } catch (err) {
    console.error(err);
    alert("Update failed");
  }finally {
    setIsSubmitting(false); 
  }

};
  React.useEffect(() => {
    loadMasters();
    loadData();
  }, [id]);

  return (
    <div className="new-request">
      <h3 className="page-title">Edit Request Form</h3>

      <div className="section-title">Request Information</div>

      <div className="form-grid">
        <div>
          <label>Request By</label>
          <input value={header.EmployeeName} readOnly />
        </div>

        <div>
          <label>Department</label>
          <input value={header.department} readOnly />
        </div>

        <div>
          <label>Reporting Manager</label>
          <input
            value={header.reportingManager}
            onChange={(e) =>
              setHeader({ ...header, reportingManager: e.target.value })
            }
          />
        </div>

        <div>
          <label>Name of Vendor *</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="">--Select--</option>
            {vendors.map((v) => (
              <option key={v.Id} value={v.Id}>
                {v.VendorName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Address of Vendor *</label>
          <textarea
            readOnly
            value={
              vendors.find((v) => v.Id === Number(selectedVendor))?.Address ||
              ""
            }
          />
        </div>

        <div>
          <label>Location *</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">--Select--</option>
            {locations.map((loc) => (
              <option key={loc.Id} value={loc.Id}>
                {loc.City}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>No of Items *</label>
          <input
            value={noOfItems}
            //onChange={(e) => setNoOfItems(e.target.value)}
            onChange={(e) => {
  const value = e.target.value;

  // allow only numbers
  if (/^\d*$/.test(value)) {
    setNoOfItems(value);

    if (value === "") return;

    let count = Number(value);

    if (count <= 0) count = 1;

    const newItems = Array.from({ length: count }, (_, i) => {
      return items[i] || {
        sr: i + 1,
        description: "",
        quantity: "",
        approx: "",
        date: "",
        purpose: "",
      };
    });

    setItems(newItems);
  }
}}
            
          />
        </div>

        <div>
          <label>UOM</label>
          <select value={uom} onChange={(e) => setUom(e.target.value)}>
            <option value="">--Select--</option>
            <option value="Box">Box</option>
            <option value="Packets">Packets</option>
          </select>
        </div>

        <div>
          <label>No of Items in box *</label>
          <input
            value={itemsPerBox}
            onChange={(e) => setItemsPerBox(e.target.value)}
          />
        </div>

        <div>
          <label>Returnable</label>
          <select
            value={returnable}
            onChange={(e) => setReturnable(e.target.value)}
          >
            <option value="">--Select--</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <table className="item-table">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Description of Material</th>
            <th>Quantity</th>
            <th>Approximate Value</th>
            <th>Probable Date</th>
            <th>Purpose for Movement</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
                 <td>{index + 1}</td>
              <td>
                <input
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].description = e.target.value;
                    setItems(updated);
                  }}
                />
              </td>

              <td>
  <input
    value={item.quantity}
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      const updated = [...items];
      updated[index].quantity = value;
      setItems(updated);
    }}
  />
</td>

<td>
  <input
    value={item.approx}
    onChange={(e) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      const updated = [...items];
      updated[index].approx = value;
      setItems(updated);
    }}
  />
</td>

             <td>
  <input
    type="date"
    value={item.date}
    onChange={(e) => {
      const updated = [...items];
      updated[index].date = e.target.value;
      setItems(updated);
    }}
  />
</td>
              <td>
                <input
                  value={item.purpose}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].purpose = e.target.value;
                    setItems(updated);
                  }}
                />
              </td>

              {/* <td>
                <button className="delete" onClick={() => removeRow(index)}>
                  ✖
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
        
      </table>
      {/* <button className="add" onClick={addRow}>
        +
      </button> */}

       <div className="attach">
          Attach Supporting Documents &nbsp;&nbsp;
          <a>View</a>
        </div>
        <br></br>

              <div className="section-title" style={{ width: "30%" }}>
          Workflow and Comment History
        </div>
        <br></br>

        <table className="item-table mt-4">
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
        <td>{new Date(w.Date).toLocaleDateString("en-IN")}</td>
        <td>{w.Comment || "-"}</td>
      </tr>
    ))
  )}
</tbody>
</table>

      <div className="bottom-area">
        <label >Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        
      </div>

      <div className="buttons">
        {/* <button className="draft" >Save as Draft</button> */}

        <button className="submit" onClick={handleUpdate} 
        disabled={isSubmitting}>
         {isSubmitting ? "Saving..." : "Submit"}
        </button>

        <button
          className="exit"
          onClick={() => history.push("/RequesterDashboard")}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default EditForm;
