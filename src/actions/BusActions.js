import Axios from "axios";
import {
  GET_ERRORS,
  GET_BUSES,
  GET_BUS,
  DELETE_BUS,
  GET_AVAILABLE_BUSES,
  MARK_BUSREPORT_AS_SOLVED,
  DELETE_BUSREPORT,
  GET_BUS_REQUISITIONS,
  GET_BUS_REQUISITION,
  DELETE_BUS_REQUISITION
} from "./types";

export const addBus = (bus, reqType, history) => async dispatch => {
  try {
    await Axios.post(`/api/bus/${reqType}`, bus);
    history.push("/bus");
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getAllBuses = () => async dispatch => {
  const res = await Axios.get(`/api/bus/all`);
  let buses = [];
  for (let i = 0; i < res.data.length; i++) {
    let bus = res.data[i];
    let tmpbus = {
      busId: bus.busId,
      number: bus.number,
      oilTankCapacity: bus.oilTankCapacity,
      gasCylinderCapacity: bus.gasCylinderCapacity,
      isAvailable: bus.isAvailable,
      schedules: (await Axios.get(`/api/bus/GLOBAL/schedule/${bus.busId}`)).data,
      busReports: (await Axios.get(`/api/bus/busReport/${bus.busId}`)).data.filter(
        busReport => busReport.solved === false
      )
    };
    buses.push(tmpbus);
  }
  dispatch({
    type: GET_BUSES,
    payload: buses
  });
};

export const getBus = (busId, history) => async dispatch => {
  try {
    const res = await Axios.get(`/api/bus/GLOBAL/${busId}`);
    dispatch({
      type: GET_BUS,
      payload: res.data
    });
  } catch (err) {
    history.push("/bus");
  }
};

export const deleteBus = (busId, history) => async dispatch => {
  if (
    window.confirm("Are you sure?")
  ) {
    try {
      await Axios.delete(`/api/bus/${busId}`);
      dispatch({
        type: DELETE_BUS,
        payload: busId
      });
    } catch (err) {
      history.push("/bus");
    }
  }
};

export const getAllAvailableBuses = () => async dispatch => {
  const res = await Axios.get(`/api/bus/all`);
  let tmpBuses = res.data;
  tmpBuses = tmpBuses.filter(bus => bus.isAvailable !== false);
  dispatch({
    type: GET_AVAILABLE_BUSES,
    payload: tmpBuses
  });
};

export const markBusReportAsSolved = (busId, busReportId, history) => async dispatch => {
  if (
    window.confirm("Are you sure?")
  ) {
    try {
      await Axios.get(`/api/busReport/markAsSolved/${busReportId}`);
      dispatch({
        type: MARK_BUSREPORT_AS_SOLVED,
        payload: { busId: busId, busReportId: busReportId }
      });

    } catch (err) {
      history.push("/bus");
    }
  }
};

export const deleteBusReportFromBus = (busId, busReportId, history) => async dispatch => {
  if (
    window.confirm("Are you sure?")
  ) {
    try {
      await Axios.delete(`/api/busReport/${busReportId}`);
      dispatch({
        type: DELETE_BUSREPORT,
        payload: { busId: busId, busReportId: busReportId }
      });

    } catch (err) {
      history.push("/bus");
    }
  }
};

export const getAllBusRequisitions = () => async dispatch => {
  const res = await Axios.get('/api/requisition/all');
  let busRequisitions = res.data;
  busRequisitions.sort(function (a, b) { return new Date(b.endDateTime) - new Date(a.endDateTime) });
  dispatch({
    type: GET_BUS_REQUISITIONS,
    payload: busRequisitions
  });
};


export const createBusRequisitions = (busRequisition, history) => async dispatch => {
  try {
    await Axios.post('/api/requisition/add', busRequisition);
    history.push('/bus/requisition');
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });

  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

export const getBusRequisition = (busRequisitionId, history) => async dispatch => {
  try {
    const res = await Axios.get(`/api/requisition/${busRequisitionId}`);
    dispatch({
      type: GET_BUS_REQUISITION,
      payload: res.data
    });
  } catch (err) {
    history.push('/bus/requisition');
  }
};

export const deleteBusRequisition = (busRequisitionId, history) => async dispatch => {
  if (
    window.confirm("Are  you sure")
  ) {
    try {
      await Axios.delete(`/api/requisition/${busRequisitionId}`);
      dispatch({
        type: DELETE_BUS_REQUISITION,
        payload: busRequisitionId
      });
    } catch (err) {
      history.push('/bus/requisition');
    }
  }
};