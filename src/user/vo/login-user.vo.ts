interface UserInfo {
    id: number;
    username: string;
    email: string;
    createTime: Date;
    updateTime: Date;
    role: string;
}



export class LoginUserVo {
    userInfo: UserInfo;
    accessToken: string;
    refreshToken: string;

}