import * as React from "react";
import { useHistory } from "react-router-dom";
import GatePass from "../../service/BAL/GatePass";
import type { IGatepassProps } from "../IGatepassProps";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
const RequesterDashboard: React.FC<IGatepassProps> = (props) => {
  const [searchText, setSearchText] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const history = useHistory();
  const [requests, setRequests] = React.useState<any[]>([]);
  const canEdit = (status: string) => {
    return status === "Sent Back" || status === "Draft";
  };
  const currentUserEmail = props.currentSPContext.pageContext.user.email;

  // const myRequests = requests.filter((item) => {
  //   return item.Author?.EMail === currentUserEmail;
  // });
  const myRequests = React.useMemo(() => {
    return requests
      .filter((item) => item.Author?.EMail === currentUserEmail)
      .sort((a, b) => b.Id - a.Id);
  }, [requests, currentUserEmail]);

  const loadRequests = async () => {
    try {
      const service = GatePass();
      const data = await service.getRequests(props);
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };
  const filteredRequests = React.useMemo(() => {
    if (!searchText) return myRequests;

    const search = searchText.toLowerCase();

    return myRequests.filter((item) => {
      return (
        item.Id?.toString().toLowerCase().includes(search) ||
        item.VendorName?.VendorName?.toLowerCase().includes(search) ||
        item.City?.City?.toLowerCase().includes(search) ||
        item.Status?.toLowerCase().includes(search)
      );
    });
  }, [myRequests, searchText]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginatedRequests = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredRequests.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredRequests, currentPage]);

  React.useEffect(() => {
    loadRequests();
    setCurrentPage(1);
  }, [searchText]);

  return (
    <div className="main">
      <div className="header">
        <div className="left-banner">
          <div className="logo-text">
            <h2>Requester Dashboard</h2>
          </div>
        </div>
      </div>

      <div className="mainsecond">
        <input
          placeholder="Search"
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* <select className="formtext-control">
          <option>All</option>
          <option>Pending for Approval</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Send Back</option>
          <option>Draft</option>
        </select> */}

        <button className="newBtn" onClick={() => history.push("/NewRequest")}>
          New Request
        </button>
      </div>

      <main className="Main-Dash">
        <div className="table-vert-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>VENDOR NAME</th>
                <th>LOCATION</th>
                <th>NO OF ITEMS</th>
                <th>GST INDICATOR</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7}>No Data</td>
                </tr>
              ) : (

                paginatedRequests.map((item) => (
                  <tr key={item.Id}>
                    <td>{item.Id}</td>
                    <td>{item.VendorName?.VendorName}</td>
                    <td>{item.City?.City}</td>
                    <td>{item.NoItems}</td>
                    <td>{item.GatePassReturnable}</td>
                    <td>{item.Status}</td>
                    <td>
                      {canEdit(item.Status) && (
                        <button
                          onClick={() => history.push(`/EditForm/${item.Id}`)}
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => history.push(`/ViewForm/${item.Id}`)}
                      >
                        <GrView />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequesterDashboard;
