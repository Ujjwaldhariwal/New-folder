import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Container } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import InputGroup from 'react-bootstrap/InputGroup';
import {
  Stack,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  CardContent,
  Card,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedIcon from '@mui/icons-material/Verified';
import GppBadIcon from '@mui/icons-material/GppBad';
import { UserListHead } from '../../sections/@dashboard/user';
import Scrollbar from '../../components/scrollbar';
import Loader from '../../components/loader/Loader';

// ----------------------------------------------------------------------
import '../../global.css';
import './UserRegistration.css';

import {
  UserRegistration,
  getUserListAPI,
  getEditProfileAPI,
  updateProfileAPI,
  searchUserAPI,
} from '../../auth/services/Services';

import { newUserName, userName, passwordValidator, userIdValidator } from '../../auth/validations/Validator';

const now = new Date();
export default function UserRegistrationComponent() {
  const fieldConfig = [
    { field: 'user_id', placeholder: 'User ID', label: 'User ID', editable: false, type: 'text' },
    { field: 'username', placeholder: 'Username', label: 'Username', editable: false, type: 'text' },
    { field: 'password', placeholder: 'Password', label: 'Password', editable: false, type: 'text' },
    {
      field: 'user_status',
      placeholder: 'User Status',
      label: 'User Status',
      editable: true,
      type: 'select',
      options: [
        { label: 'select', value: '' },
        { label: 'ACTIVE', value: 'ACTIVE' },
        { label: 'BLOCKED', value: 'BLOCKED' },
      ],
    },
    { field: 'edit', placeholder: '', label: '', editable: false, type: 'text' },
  ];

  const DATA_GRID_HEADER = [
    { id: 'USERNAME', label: 'UserName', alignRight: false, width: 140 },
    { id: 'USER_ID', label: 'User ID ', alignRight: false, width: 140 },
    { id: 'USER_STATUS', label: 'User Status', alignRight: false, width: 140 },
    { id: 'ROLE_ID', label: 'Role ID', alignRight: false, width: 140 },
    { id: '', label: '', alignRight: false, width: 20 },
  ];

  const userID = useSelector((state) => state.auth.data.userID);

  const [isOpen, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [respMsg, setRespMsg] = useState('');

  const [formData, setFormData] = useState({
    rowid: '',
    password: '',
    username: '',
    user_id: '',
    role_id: '',
    hierarchy: '',
    user_status: '',
  });

  const [updateProfileData, setUpdateProfileData] = useState({
    password: '',
    name: '',
    user_id: '',
    user_status: '',
    hierarchy: '',
    role_id: '',
    menu: [],
  });

  const [scroll, setScroll] = useState('body');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [userIDVal, setUserIDVal] = useState('');
  const [userList, setUserList] = useState(null);
  const [searchUserID, setSearchUserID] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(10);

  const dispatch = useDispatch();

  const [isOpenEdit, setOpenEdit] = useState(false);

  const reportMenus = ['Report', 'Connection Status', 'PF', 'Disconnection Aging', 'DC & RC', 'Communication Status'];

  const handleClose = () => {
  setFormData((prevData) => ({
    ...prevData,
    rowid: '',
    password: '',
    username: '',
    user_id: '',
    role_id: '',
    hierarchy: '',
    user_status: '',
  }));
    setUserIDVal('');
    setIsSuccess(false);
    setRespMsg('');
    setOpen(false);
    setOpenEdit(false);
    setSearchUserID('');
    loadUserList();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const searchUserOnChange = (e) => {
    toast.dismiss();
    if (e.target.value) {
      e.target.value = e.target.value.replace(/[^a-zA-Z0-9_@]/g, '');
    } else {
      searchUsers(e.target.value);
    }

    const newVal = e.target.value;
    setSearchUserID(newVal);
  };

  const searchUserOnEnter = (e) => {
    toast.dismiss();
    if (e?.code == 'Enter') {
      searchUsers(searchUserID);
    }
  };

  const searchUsers = (user_id) => {
    searchUserAPI(user_id)
      .then((res) => {
        if (res?.status === true) {
          setUserList(res.data);
          setTotalPages(Math.ceil(res.data.length / 8));
        } else {
          setUserList(null);
          toast.error(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  const onClickSearchBtn = (e) => {
    toast.dismiss();
    e?.preventDefault();

    searchUserAPI(searchUserID)
      .then((res) => {
        if (res?.status === true) {
          setUserList(res.data);
          setTotalPages(Math.ceil(res.data.length / 8));
        } else {
          setUserList(null);
          // toast.error(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  const defaultFormData = fieldConfig.reduce((formData, fieldName) => {
    formData[fieldName.field] = '';
    return formData;
  }, {});

  const openAddPopup = () => {
    setSelectedItem(defaultFormData);
    setOpen(true);
  };

  const handleSubmit = (e) => {
    toast.dismiss();
    e.preventDefault();
    setIsLoading(false);
    setRespMsg('');

    if (newUserName(formData.username)) {
      toast.error(newUserName(formData.username));
      return;
    }
    if (passwordValidator(formData.password)) {
      toast.error(passwordValidator(formData.password));
      return;
    }
    if (userIdValidator(formData.user_id)) {
      toast.error(userIdValidator(formData.user_id));
      return;
    }

    if (!formData.hierarchy) {
      toast.error("Hierarchy is required");
      return;
    }

    const reqData = {
      password: formData.password,
      username: formData.username,
      user_id: formData.user_id,
      roleid: formData.hierarchy,
      created_by: userID,
    };
    setIsLoading(true);
    UserRegistration(reqData)
      .then((res) => {
        setIsLoading(false);
        if (res?.status === true) {
          setIsSuccess(true);
          loadUserList();
        } else {
          // toast.error(res.message);
          setRespMsg(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  const handleEditProfileChange = (e) => {
    if (e.target.name === 'user_id') {
      e.target.value = e.target.value.replace(/[^a-zA-Z0-9_@]/g, '');
    }

    const { name, value } = e.target;
    setUpdateProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setUpdateProfileData((prevData) => {
      if (reportMenus.includes(name)) {
        const updatedMenu = checked
          ? prevData.menu.includes('Report')
            ? [...prevData.menu, name]
            : [...prevData.menu, name, 'Report']
          : prevData.menu.filter((menuItem) => menuItem !== name);
        return { ...prevData, menu: updatedMenu };
      } else {
        const updatedMenu = checked ? [...prevData.menu, name] : prevData.menu.filter((menuItem) => menuItem !== name);
        return { ...prevData, menu: updatedMenu };
      }
    });
  };

  const handleEditReportCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setUpdateProfileData((prevData) => {
      const updatedMenu = checked
        ? prevData.menu.concat(reportMenus.filter((itm) => !prevData.menu.includes(itm)))
        : [...prevData.menu.filter((itm) => !reportMenus.includes(itm))];
      return { ...prevData, menu: updatedMenu };
    });
  };

  const handleEditClick = (e) => {
    const rowItme = userList.filter((val) => val.user_id === e.currentTarget.id);
    getEditProfileAPI(rowItme[0]?.user_id)
      .then((res) => {
        if (res?.status === true) {
          setUpdateProfileData(res.data);
        } else {
          // toast.error(res.message);
          setRespMsg(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });

    setScroll('paper');
    setScroll('body');
    setOpenEdit(true);
  };

  const handleUpdateUser = (e) => {
    toast.dismiss();
    e.preventDefault();
    setIsLoading(false);
    setRespMsg('');

    if (newUserName(updateProfileData.name)) {
      toast.error(newUserName(updateProfileData.name));
      return;
    }
    if (passwordValidator(updateProfileData.password)) {
      toast.error(passwordValidator(updateProfileData.password));
      return;
    }

    if (userIdValidator(updateProfileData.user_id)) {
      toast.error(userIdValidator(updateProfileData.user_id));
      return;
    }

    const reqData = {
      password: updateProfileData.password,
      user_status: updateProfileData.user_status,
      name: updateProfileData.name,
      user_id: updateProfileData.user_id,
      menu: updateProfileData.menu,
    };
    setIsLoading(true);
    updateProfileAPI(reqData)
      .then((res) => {
        setIsLoading(false);
        if (res?.status === true) {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, 5000);
        } else {
          // toast.error(res.message);
          setRespMsg(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  const loadUserList = () => {
    setIsLoading(true);
    getUserListAPI() // get getUserList
      .then((res) => {
        setIsLoading(false);
        if (res?.status === true) {
          setUserList(res.data);
          setTotalPages(Math.ceil(res.data.length / 8));
        } else {
          // toast.error(res.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err);
      });
  };

  useEffect(() => {
    loadUserList();
  }, []);
  
  return (
    <>
      <Helmet>
        <title> User Registration | MBM </title>
      </Helmet>

      <Loader propData={isLoading} />

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
          <Typography variant="h5" style={{ color: 'var(--primary-color)', fontWeight: '700' }} gutterBottom>
            User Registration
          </Typography>
        </Stack>
        <div className="registrationCard">
          <Card style={{ padding: '25px' }}>
            <div style={{ display: 'flex', marginBottom: 20, justifyContent: 'space-between' }}>
              <div>
                   <InputGroup style={{ width: '330px' }} className="register-search-input">
                <TextField
                  label="User ID"
                  aria-label="Search..."
                  aria-describedby="basic-addon2"
                  value={searchUserID}
                  onChange={searchUserOnChange}
                  onKeyDown={searchUserOnEnter}
                  style={{ fontSize: '16px', borderRadius: "5px" }}
                  placeholder="Search User..."
                  InputLabelProps={{ shrink: true }}
                  FormHelperTextProps={{
                    className: 'mui-custom-legend',
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px 0px 0px 8px",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  id="search_btn"
                  className="themeColor"
                  onClick={onClickSearchBtn}
                  style={{ fontSize: '14px' }}
                >
                  Search
                </Button>
              </InputGroup>
              </div>
           
              <Tooltip title="Register User">
                <span>
                  <PersonAddIcon
                    className="register-icon"
                    style={{ color: 'var(--primary-color)', cursor: 'pointer', fontSize: '35px', marginRight: '30px' }}
                    onClick={openAddPopup}
                  />
                </span>
              </Tooltip>
            </div>

            <Card className="customDashboardCardbg">
              <CardContent style={{ padding: '0px' }}>
                <div>
                  <Scrollbar>
                    <TableContainer sx={{ minWidth: 900 }}>
                      <Table>
                        <UserListHead headLabel={DATA_GRID_HEADER} />
                        {userList && userList.length > 8 ? (
                          <TableBody className="customTableBody">
                            {userList &&
                              userList.slice((currentPage - 1) * 8, currentPage * 8).map((value, index) => (
                                <TableRow hover key={index} tabIndex={-1}>
                                  <TableCell>{value.name}</TableCell>
                                  <TableCell>{value.user_id}</TableCell>
                                  <TableCell>{value.user_status}</TableCell>
                                  <TableCell>{value.role_id}</TableCell>
                                  <TableCell align="right" className="sticky-column">
                                    <Tooltip title="Edit User" disableInteractive>
                                      <span>
                                        <EditIcon
                                          style={{ color: '#3b7299', cursor: 'pointer' }}
                                          id={value.user_id}
                                          onClick={handleEditClick}
                                        />
                                      </span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell style={{ display: 'none' }}>{value.password}</TableCell>
                                  <TableCell style={{ display: 'none' }}>{value.password}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        ) : (
                          <TableBody className="customTableBody">
                            {userList &&
                              userList.map((value, index) => (
                                <TableRow hover key={index} tabIndex={-1}>
                                  <TableCell>{value.name}</TableCell>
                                  <TableCell>{value.user_id}</TableCell>
                                  <TableCell>{value.user_status === 'A' ? 'Active' : 'Block'}</TableCell>
                                  <TableCell>{value.role_id}</TableCell>
                                  <TableCell align="right" className="sticky-column" style={{ width: '8px' }}>
                                    <Tooltip title="Edit User" disableInteractive>
                                      <span>
                                        <EditIcon
                                          style={{ color: '#3b7299', cursor: 'pointer' }}
                                          id={value.user_id}
                                          onClick={handleEditClick}
                                        />
                                      </span>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell style={{ display: 'none' }}>{value.password}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        )}

                        {!userList && (
                          <TableBody>
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={9}
                                sx={{ py: 3 }}
                                style={{ borderBottom: '1px solid var(--secondary-border-color)' }}
                              >
                                <Paper
                                  sx={{
                                    textAlign: 'center',
                                    background: 'transparent',
                                    color: 'var(--primary-color)',
                                  }}
                                >
                                  <Typography variant="h6" paragraph style={{marginBottom: "0"}}>
                                    No Data found
                                  </Typography>

                                  {/* <Typography variant="body2">
                                    Please type correct user id. &nbsp;
                                    <br /> Try checking for typos or using complete words.
                                  </Typography> */}
                                </Paper>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        )}
                      </Table>
                    </TableContainer>
                  </Scrollbar>
                </div>
              </CardContent>
            </Card>

            {userList && userList.length > 8 && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '15px' }}>
                <Typography style={{ margin: '12px 0px' }}>Pages:</Typography>
                <ReactPaginate
                  previousLabel={`Previous`}
                  nextLabel={'Next'}
                  breakLabel={'...'}
                  pageCount={totalPages}
                  onPageChange={(page) => setCurrentPage(page.selected + 1)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={pageRangeDisplayed}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />
              </div>
            )}
          </Card>
        </div>
      </Container>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
        className="registrationPopUpCard"
      >
        <form onSubmit={handleSubmit} className="form-wrapper">
          <DialogTitle
            id="scroll-dialog-title"
            style={{ fontSize: '1.2rem', fontWeight: '600', borderBottom: '1px solid var(--primary-border-color)', color: 'var(--primary-color)' }}
          >
            User Registration
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'var(--primary-color)',
                cursor: 'pointer',
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <div id="scroll-dialog-description" tabIndex={-1}>
              <Card className="p-0 mt-4 customDashboardCardbg">
                <CardContent className="p-3">
                  <Box
                    sx={{
                      border: '1px solid var(--primary-border-color)',
                      padding: '25px',
                      position: 'relative',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        top: '-15px',
                        left: '10px',
                        padding: '0 10px',
                        backgroundColor: 'var(--card-color)',
                        color: 'var(--primary-color)',
                      }}
                    >
                      User Details
                    </Typography>
                    <Grid container spacing={2} columns={{ xs: 3, md: 12 }}>
                      <Grid item xs={3}>
                        <TextField
                          label="Name"
                          name="username"
                          // value={formData[field.field]}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          placeholder="Enter Name"
                          id="username"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          label="Password"
                          name="password"
                          id="userPassword"
                          // value={formData[field.field]}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          placeholder="Enter Password"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          label="User ID"
                          name="user_id"
                          id="user_id"
                          // value={formData[field.field]}
                          onChange={handleChange}
                          fullWidth
                          margin="normal"
                          placeholder="Enter User ID"
                          // disabled={!field.editable ? 'true' : ''}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField
                          label="Hierarchy"
                          name="hierarchy"
                          id="hierarchy"
                          SelectProps={{
                            native: true,
                          }}
                          select
                          onChange={handleChange}
                          sx={{ marginTop: '15px' }}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          className=""
                        >
                          <option className="selectBoxOption" key="" value="">
                            --Select --
                          </option>
                          <option className="selectBoxOption" key="reports" value="REPORT">
                            Reports
                          </option>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
              {/* </Card> */}
            </div>
          </DialogContent>
          <DialogActions
            className="mb-3"
            style={{ display: 'flex', justifyContent: 'space-between', marginRight: '15px', marginLeft: '15px' }}
          >
            {!(respMsg || isSuccess) ? <div> </div> : ''}
            {respMsg ? (
              <div style={{ color: 'red', marginRight: '15px' }}>
                <GppBadIcon style={{ cursor: 'pointer', fontSize: '30px' }} />
                <i>{respMsg}</i>
              </div>
            ) : (
              ''
            )}
            {isSuccess ? (
              <div style={{ color: 'green', marginRight: '15px' }}>
                <VerifiedIcon style={{ cursor: 'pointer', fontSize: '30px' }} />
                <i>Registration successfully completed!!</i>
                {/* <i>Registration Successfully. Please note down user id <b>{userIDVal}</b></i> */}
              </div>
            ) : (
              ''
            )}

            <Button
              type="submit"
              variant="contained"
              className="themeColor"
              style={{ height: '40px', fontSize: '18px' }}
              disabled={isSuccess}
            >
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit user pop up */}
      <Dialog
        open={isOpenEdit}
        onClose={handleClose}
        closeAfterTransition
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
        className="registrationPopUpCard"
      >
        <form onSubmit={handleUpdateUser} className="form-wrapper">
          <DialogTitle
            id="scroll-dialog-title"
            style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-color)', borderBottom: '1px solid var(--primary-border-color)' }}
          >
            Update User Profile
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'var(--primary-color)',
                cursor: 'pointer',
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <div id="scroll-dialog-description" tabIndex={-1}>
              {/* <Card> */}
              <Card className="mb-1 mt-3 p-0 customDashboardCardbg">
                <CardContent className="p-3">
                  <Box
                    sx={{
                      border: '1px solid var(--primary-border-color)',
                      padding: '25px',
                      position: 'relative',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        top: '-15px',
                        left: '10px',
                        padding: '0 10px',
                        backgroundColor: 'var(--card-color)',
                        color: 'var(--primary-color)',
                      }}
                    >
                      User Details
                    </Typography>
                    <Grid container spacing={4} columns={{ xs: 4, md: 12 }}>
                      <Grid item xs={4}>
                        <TextField
                          label="Name"
                          name="name"
                          id="editName"
                          onChange={handleEditProfileChange}
                          value={updateProfileData.name}
                          fullWidth
                          margin="normal"
                          placeholder="Enter Name"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          label="Password"
                          name="password"
                          id="editPassword"
                          value={updateProfileData.password}
                          onChange={handleEditProfileChange}
                          fullWidth
                          margin="normal"
                          placeholder="Enter Password"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          label="User ID"
                          name="user_id"
                          id="editUserID"
                          value={updateProfileData.user_id}
                          onChange={handleEditProfileChange}
                          fullWidth
                          margin="normal"
                          placeholder="Enter User ID"
                          InputLabelProps={{ shrink: true }}
                          disabled
                          style={{ cursor: 'not-allowed' }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={4} columns={{ xs: 4, md: 12 }}>
                      <Grid item xs={4}>
                        <TextField
                          label="Hierarchy"
                          name="hierarchy"
                          id="editHierarchy"
                          SelectProps={{
                            native: true,
                          }}
                          select
                          value={updateProfileData.role_id}
                          onChange={handleEditProfileChange}
                          sx={{ marginTop: '15px' }}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        >
                          <option className="selectBoxOption" key="" value="">
                            --Select --
                          </option>
                          <option className="selectBoxOption" key="report" value="REPORT">
                            Reports
                          </option>
                        </TextField>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="User Status"
                          name="user_status"
                          id="editUserStatus"
                          value={updateProfileData.user_status}
                          SelectProps={{
                            native: true,
                          }}
                          select
                          onChange={handleEditProfileChange}
                          sx={{ marginTop: '15px' }}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        >
                          <option className="selectBoxOption" key="" value="">
                            --Select --
                          </option>
                          <option className="selectBoxOption" key="A" value="A">
                            Active
                          </option>
                          <option className="selectBoxOption" key="B" value="B">
                            Block
                          </option>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* group 2 */}
              <Card className="p-0 mt-3 customDashboardCardbg">
                <CardContent className="p-3">
                  <Box
                    sx={{
                      border: '1px solid var(--primary-border-color)',
                      padding: '25px',
                      position: 'relative',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        top: '-15px',
                        left: '10px',
                        padding: '0 10px',
                        backgroundColor: 'var(--card-color)',
                        color: 'var(--primary-color)',
                      }}
                    >
                      Role Rights
                    </Typography>
                    <Grid container spacing={2} columns={{ xs: 4, md: 12 }}>
                      <Grid item xs={12} sm={12} lg={4} md={4}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('Dashboard')}
                                onChange={handleEditCheckboxChange}
                                name="Dashboard"
                              />
                            }
                            className="bold-checkbox-label primaryColor"
                            label="Dashboard"
                            id="dashboardReport"
                          />
                        </FormGroup>
                      </Grid>

                      {/* <Grid item xs={12} sm={12} lg={4} md={4}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('Report')}
                                onChange={handleEditReportCheckboxChange}
                                name="Report"
                              />
                            }
                            className="bold-checkbox-label primaryColor"
                            label="Report"
                            id="report"
                          />
                          <FormControlLabel
                            className="margin-left primaryColor"
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('Connection Status')}
                                onChange={handleEditCheckboxChange}
                                name="Connection Status"
                              />
                            }
                            label="Connection Status"
                            id="connectionStatus"

                          />

                          <FormControlLabel
                            className="margin-left primaryColor"
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('Communication Status')}
                                onChange={handleEditCheckboxChange}
                                name="Communication Status"
                              />
                            }
                            label="Communication Status"
                            id="communicationStatus"
                          />

                          <FormControlLabel
                            className="margin-left primaryColor"
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('PF')}
                                onChange={handleEditCheckboxChange}
                                name="PF"
                              />
                            }
                            label="PF"
                            id="PF"
                          />

                          <FormControlLabel
                            className="margin-left primaryColor"
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('DC & RC')}
                                onChange={handleEditCheckboxChange}
                                name="DC & RC"
                              />
                            }
                            label="DC & RC"
                            id="DC&RC"
                          />

                          <FormControlLabel
                            className="margin-left primaryColor"
                            control={
                              <Checkbox
                                className="checkbox-padding"
                                checked={updateProfileData.menu.includes('Disconnection Aging')}
                                onChange={handleEditCheckboxChange}
                                name="Disconnection Aging"
                              />
                            }
                            label="Disconnection Aging"
                            id="disconnectionAging"
                          />
                        </FormGroup>
                      </Grid> */}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
          <DialogActions
            className="mb-3"
            style={{ display: 'flex', justifyContent: 'space-between', marginRight: '15px', marginLeft: '15px' }}
          >
            {!(respMsg || isSuccess) ? <div> </div> : ''}
            {respMsg ? (
              <div style={{ color: 'red', marginRight: '15px' }}>
                <GppBadIcon style={{ cursor: 'pointer', fontSize: '30px' }} />
                <i>{respMsg}</i>
              </div>
            ) : (
              ''
            )}
            {isSuccess ? (
              <div style={{ color: 'green', marginRight: '15px' }}>
                <VerifiedIcon style={{ cursor: 'pointer', fontSize: '30px' }} />
                <i>User Profile Update successfully!!</i>
              </div>
            ) : (
              ''
            )}
            <Button
              type="submit"
              variant="contained"
              className="themeColor"
              style={{ height: '40px', fontSize: '18px' }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
