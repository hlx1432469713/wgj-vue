import axios from 'axios';

let base = '';

axios.interceptors.request.use(
    config => {
       if(window.localStorage.getItem('token')){
          config.headers.token = window.localStorage.getItem('token');
       }
      return config;
    },
    err => {
       return Promise.reject(err);
 });
 
// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
//
// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };
//
// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };
//
// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };
//
// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };
//
// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };


// 管理员
export const getUserInfoById = params => { return axios.get(`/admin/getUserInfoById/${params.userId}`).then(res => res.data); };

export const getAllAdminInfo = params => { return axios.post(`/admin/getAllAdminInfo`, params).then(res => res.data); };

// export const getAllAdminByUsername = params => { return axios.post(`/admin/getAllAdminByUsername`, params).then(res => res.data); };

export const deleteAdminInfoById = params => { return axios.post(`/admin/deleteAdminInfoById`, params).then(res => res.data); };

export const addAdminInfo = params => { return axios.post(`/admin/addAdminInfo`, params).then(res => res.data); };

export const updateAdminInfo = params => { return axios.post(`/admin/updateAdminInfo`, params).then(res => res.data); };

export const adminLogin = params => { 
    return axios.post(`/public/admin/login`, params).then(res => {
        if(res.data.status == 1){
            let token = res.headers.refresh
        window.localStorage.setItem('token',token);
        // window.localStorage.setItem('user',JSON.stringify(res.data.result))
        window.localStorage.setItem('user',res.data.result.userId)
        return res
        }
        else
            return null;

    }); 
};

//管理用户分组

// export const getAdminGroupById = params => { return axios.post(`/admin/AdminGroup/getAdminGroupById`, params).then(res => res.data); };

// export const getAdminGroupByName = params => { return axios.post(`/admin/AdminGroup/getAdminGroupByName`, params).then(res => res.data); };

export const deleteAdminGroup = params => { return axios.post(`/admin/AdminGroup/deleteAdminGroup`, params).then(res => res.data); };

export const addAdminGroup = params => { return axios.post(`/admin/AdminGroup/addAdminGroup`, params).then(res => res.data); };

export const updateAdminGroupById = params => { return axios.post(`/admin/AdminGroup/updateAdminGroupById`, params).then(res => res.data); };

export const getAllAdminGroup = params => { return axios.post(`/admin/AdminGroup/getAllAdminGroup`, params).then(res => res.data); };

//车辆
export const getCarInfoByCarId = params => { return axios.get(`/admin/car/getCarInfoByCarId/${params.carId}`).then(res => res.data); };

export const updateCarInfoByCarId = params => { return axios.post(`/admin/car/updateCarInfoByCarId`, params).then(res => res.data); };

export const updateDriverInfoByDriverId = params => { return axios.post(`/admin/driver/updateDriverInfoByDriverId`, params).then(res => res.data); };

export const deleteCarInfoByCarId = params => { return axios.post(`/admin/car/deleteCarInfoByCarId`, params).then(res => res.data); };

export const deleteDriverInfoByDriverId = params => { return axios.post(`/admin/driver/deleteDriverInfoByDriverId`, params).then(res => res.data); };

export const importExcel = params => { return axios.post(`/admin/driver/importExcel`, params).then(res => res.data); };

export const makeExcel = () => { return axios.post(`/admin/driver/makeExcel`,).then(res => res.data); };

export const changCar = params => { return axios.post(`/admin/driver/changCar`,params).then(res => res.data); };


export const addCarInfo = params => { return axios.post(`/admin/car/addCarInfo`, params).then(res => res.data); };

export const getCarInfoByCarNumber = params => { return axios.get(`/admin/car/getCarInfoByCarNumber/${params.carNumber}`, ).then(res => res.data); };

export const findCarInfoByMultiCondition = params => { return axios.post(`/admin/car/findCarInfoByMultiCondition`, params).then(res => res.data); };

export const getDriverInfoByMultiCondition = params => { return axios.post(`/admin/driver/getDriverInfoByMultiCondition`, params).then(res => res.data); };

export const getCarInfoNoCompatibleByCarNumber = params => { return axios.get(`/admin/car/getCarInfoNoCompatibleByCarNumber/${params}`,).then(res => res.data); };

export const getDriverInfoByDriverId = params => { return axios.get(`/admin/driver/getDriverInfoByDriverId/${params}`,).then(res => res.data); };

export const getCarOff = params => { return axios.post(`/admin/driver/getCarOff`,params).then(res => res.data); };

//车辆定位
export const getAllCarLocation = () => { return axios.get(`/admin/driver/getAllCarLocation`).then(res => res.data); };

export const getLocationInfoByDate = param => { return axios.post(`/admin/order/getLocationInfoByDate`, param).then(res => res.data); };

//用户行为日志管理
export const findLogInfoMultiCondition = params => { return axios.post(`/admin/logInfo/findLogInfoMultiCondition`, params).then(res => res.data); };

export const getLogInfoByLogId = params => { return axios.post(`/admin/logInfo/getLogInfoByLogId`,params).then(res => res.data); };

// 投诉订单管理
export const findComplaintInfoByMultiCondition = params => { return axios.post(`/admin/complaintInfo/findComplaintInfoByMultiCondition`, params).then(res => res.data); };
export const  updateComplaintInfoByComplaintId = params => { return axios.post(`/admin/complaintInfo/updateComplaintInfoByComplaintId`, params).then(res => res.data); };

// export const getLocationInfoByDate = param => { return axios.post(`/admin/order/getLocationInfoByDate`, param).then(res => res.data); };


//Order订单接口

export const findOrderInfoByMultiCondition = param => { return axios.post(`/admin/findOrderInfoByMultiCondition`,param).then(res => res.data); };
// export const getCarInfoByCarId = params => { return axios.get(`/api/driver/getOrderInfoByDriverId}`).then(res => res.data); };

//
export const getTrafficSituation = () => { return axios.post(`/admin/point/getTrafficSituation`).then(res => res.data); };

export const getMonthOrderInfoByYear =param =>{ return axios.post(`/admin/count/getMonthOrderInfoByYear`, param).then(res => res.data);};
export const getOrderByMonth =param =>{ return axios.post(`/admin/count/getOrderByMonth`, params).then(res => res.data);};
export const getOrderByDriverId =param =>{ return axios.post(`/admin/count/getOrderByYear`, params).then(res => res.data);};
export const getAllOrderNum =() =>{ return axios.get(`/admin/count/getAllOrderNum`).then(res => res.data);};
export const getOrderByCarNumber =param =>{ return axios.post(`/admin/count/getOrderByMonth`, params).then(res => res.data);};