/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export function validateLoginUsername(rule, value, callback) {
  rule;
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    callback();
  }
}

export function validateRegisterUsername(rule, value, callback) {
  rule;
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    callback();
  }
}

export function validateLoginPassword(rule, value, callback) {
  rule;
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
}

export function validateRegisterPassword(rule, value, callback) {
  rule;
  if (value.length < 6) {
    callback(new Error("输入的密码长度不能小于6"));
  } else {
    callback();
  }
}

export function validateRegisterEmail(rule, value, callback) {
  rule;
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'));
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正确的邮箱格式'));
    }
  }, 100);
}
