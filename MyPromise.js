class MyPromise {
	constructor(fn) {
		this._SUCCESS = Symbol();
		this._ERROR = Symbol();
		this._quene = [];
		this._status;
		this._succ_res;
		this._err_res;
		fn((...args) => {
			this._succ_res = args;
			this._status = this._SUCCESS;
			this._quene.forEach(cb => {
				cb.resCb(...args);
			});
		}, (...err) => {
			this._succ_res = err;
			this._status = this._ERROR;
			this._quene.forEach(cb => {
				cb.rejCb(...err);
			});
		});
	}
	then(resCb, rejCb) {
		if (this._status == this._SUCCESS) {
			resCb(...this._succ_res);
		} else if (this._status == this._ERROR) {
			rejCb(...this._err_res);
		} else {
			this._quene.push({
				resCb,
				rejCb
			});
		}
	}
}

MyPromise.all = function(arr) {
	return new MyPromise((resolve, reject) => {
		let _res_arr = [];
		_next_pro(0);
		function _next_pro(_index) {
			if (_index >= arr.length) {
				resolve(_res_arr);
			} else {
				arr[_index].then(_res => {
					_res_arr.push(_res);
					_index++;
					_next_pro(_index);
				}, reject);
			}
		}
	})
}
