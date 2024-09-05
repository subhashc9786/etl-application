import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const CompanyDataTable = () => {
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [editData, setEditData] = useState(null); // To manage edit state
  const [isEditing, setIsEditing] = useState(false); // To toggle between add and edit modes
  const [modelInfo, setModelInfo] = useState({ title: "", buttonLabel: "" });

  async function newFun() {
    try {
      const respone = await axios.get(
        "http://localhost:5000/api/v1/customers/customer"
      );
      setReports(respone.data);
      setReport(respone.data);
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  useEffect(() => {
    newFun();
  }, []);

  const tableColumns = [
    {
      name: "EMAIL",
      selector: (row) => row.email,
      sortable: true,
      minWidth: "170px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "240px",
    },
    {
      name: "PHONE N0.",
      selector: (row) => row.phone,
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {" "}
          <EditIcon
            className="editIcon"
            onClick={() => handleEdit(row)}
          ></EditIcon>
          <DeleteIcon onClick={() => handleDelete(row.id)}></DeleteIcon>
        </div>
      ),
      width: "150px",
    },
  ];

  const tableDataItems = reports?.map((customer) => {
    return {
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      //   "manage": ,
      id: customer._id,
    };
  });



  useEffect(() => {
    if (searchKeyword.match(/^[a-zA-Z0-9!@. ]+$/g)) {
      let data = [];
        data.push(...reports.filter((reportInfo) => reportInfo.email&& reportInfo.email.match(searchKeyword)));
        data.push(...reports.filter((reportInfo) => reportInfo.name && reportInfo.name.match(searchKeyword)));
        data.push(...reports.filter((reportInfo) => reportInfo.phone && reportInfo.phone.match(searchKeyword)));

        data = data.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.id === value.id
          ))
        )
        setReports(data);
    }
    else{
      setReports(report);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  const handleEdit = (row) => {
    setModelInfo({ title: "Edit ", buttonLabel: "UPDATE" });
    setEditData(row);

    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/customers/${id}`);
      newFun();
    } catch (error) {
      console.error("Error deleting selected rows:", error);
    }
  };

  const handleAddUpdate = async (data) => {
    try {
      if (isAdd) {
        await axios.post(
          "http://localhost:5000/api/v1/customers/customer",
          data
        );
        newFun();
        setIsEditing(false);
        setEditData(null);
      } else {
        await axios.put(
          `http://localhost:5000/api/v1/customers/${data.id}`,
          data
        );
        newFun();
        setIsEditing(false);
        setEditData(null);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleOpenAddModel = () => {
    setModelInfo({ title: "Add ", buttonLabel: "ADD " });
    setEditData("");
    setIsAdd(true);
    setIsEditing(true);
  };

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      <div className="table-container">
        <div className="add-button">
          <button onClick={handleOpenAddModel}>Add</button>
        </div>
        <div className="main-table">
          <DataTable
            data={tableDataItems}
            columns={tableColumns}
            pagination
            highlightOnHover
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 252px)"
          />
        </div>
        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
          <DialogTitle>{modelInfo.title}</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUpdate(editData);
              }}
            >
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editData?.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={editData?.email || ""}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Phone"
                type="text"
                fullWidth
                variant="outlined"
                value={editData?.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAddUpdate(editData);
                setIsEditing(false);
              }}
              color="primary"
              variant="contained"
            >
              {modelInfo.buttonLabel}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CompanyDataTable;
