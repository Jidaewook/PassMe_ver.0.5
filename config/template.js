

exports.resetEmail = (req, resetToken) => {
    const message = {
        subject: 'Reset Password',
        text: `http://localhost:7000/reset-password/${resetToken}` + "리셋과 관련된 설명"
    };

    return message;
};

// 패스워드 컨펌

exports.confirmResetPasswordEmail = () => {
    const message = {
        subject: 'Password Changed',
        text: 
            `패스워드가 변경되었다는 설명`
    };

    return message;
};

// 회원가입 안내 메일

exports.signupEmail = name => {
    const message = {
        subject: 'Account Registration',
        text: 
            `회원가입이 완료되었다는 설명`
    };

    return message;
};

// 뉴스레터(주기적으로 보낼 때) - 뉴스레터는 메일군이 아니라 다른 서비스를 사용해야 한다.

// 컨택메시지

exports.contactusEmail = () => {
    const message = {
        subject: 'Contact Us',
        text:
            `메일 접수를 받았다는 내용`
    };

    return message;
};

