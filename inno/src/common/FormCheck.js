
const alertMessage = {
    notnull: "필수 입력 항목입니다.",
    ipv4: "유효하지 않은 IP 주소입니다.",
    numeric: "숫자만 입력 가능합니다.",
    alphabet: "",
    passwd: "비밀번호 생성 규칙.",
    passwd_confirm: "비밀번호가 일치하지 않습니다.",
    email: "유효하지 않은 이메일 형식입니다.",
}

//0.0.0.0~255.255.255.255->true
const regexIPv4 = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/
const checkIPv4 = (ip) => {
    return regexIPv4.test(ip) ? null :alertMessage.ipv4
}

const checkMatch = (source, target) => {
    return source.localCompare(target) === 0
}

const checkNull = (content) => {
    if (content) {
        switch (typeof(content)) {
        case "string":
            if (content !== "")
                return null
            break;
        default:
            break;
        }
    }
    return alertMessage.notnull
}

const regexNum = /^[1-9][\d]*$/
const checkOnlyNumeric = (content) => {
    return regexNum.test(content) ? null : alertMessage.numeric
}

const checkPasswdPattern = (password) => {
    return false
}

const FormCheck = {
    ipv4: checkIPv4,
    notnull: checkNull,
    numeric: checkOnlyNumeric,
    password: checkPasswdPattern,
    password_confirm: checkMatch,
}

export default FormCheck;