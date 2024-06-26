import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsComponent } from "./BottomTabs";
//COMPONENTS
import SearchBarSelect from "../components/SearchBarSelect";
import CustomBackButton from "../components/CustomBackButton";
import Header from "../components/Header";
import HeaderTinNhan from "../components/HeaderTinNhan";
//UTILS
import Button from "../utils/Button";
//SCREENS
import TaiKhoanVaBaoMat from "../screens/canhan-screens/TaiKhoanVaBaoMat";
import QuyenRiengTu from "../screens/canhan-screens/QuyenRiengTu";
import ReelScreen from "../screens/khampha-screens/ReelScreen";
import CaiDat from "../screens/khac-screens/CaiDatNhanh";
import QRCodeScreen from "../screens/khac-screens/QRCodeScreen";
import TaoMatKhau from "../screens/dangky-screens/TaoMatKhau";
import ChonAnhDaiDien from "../screens/dangky-screens/ChonAnhDaiDien";
import NhapTenNguoiDung from "../screens/dangky-screens/NhapTenNguoiDung";
import TrangChu from "../screens/trangchu-screens/TrangChu";
import DangNhap from "../screens/dangnhap-screens/DangNhap";
import See from "../screens/nhatky-screens/See";
import NhapSoDienThoai from "../screens/dangky-screens/NhapSoDienThoai";
import NhapMaXacThuc from "../screens/dangky-screens/NhapMaXacThuc";
import NhapThongTinCaNhan from "../screens/dangky-screens/NhapThongTinCaNhan";
import ChatScreen from "../screens/tinnhan-screens/ChatScreen";
import DoiMatKhauScreen from "../screens/khac-screens/DoiMatKhauScreen";
import DangNhapThanhCong from "../screens/dangnhap-screens/DangNhapThanhCong";
import LayLaiMatKhau from "../screens/dangnhap-screens/LayLaiMatKhau";
import MaXacThucLayLaiMatKhau from "../screens/dangnhap-screens/MaXacThucLayLaiMatKhau";
import DanhBaMay from "../screens/danhba-screens/DanhBaMay";
import LoiMoiKetBan from "../screens/danhba-screens/LoiMoiKetBan";
import TimKiem from "../screens/khac-screens/TimKiem";
import TaoNhom from "../screens/khac-screens/TaoNhom";
import ChanhRecived from "../screens/test-screens/ChanhRecived";
import ChanhSender from "../screens/test-screens/ChanhSender";
import ThongTinNhom from "../screens/tinnhan-screens/ThongTinNhom";
import ThanhVienNhom from "../screens/tinnhan-screens/ThanhVienNhom";
import TruongNhomMoi from "../screens/tinnhan-screens/TruongNhomMoi";
import ChuyenTiep from "../screens/tinnhan-screens/ChuyenTiep";
import ThemNhieuThanhVienVaoNhom from "../screens/tinnhan-screens/ThemNhieuThanhVienVaoNhom";
import ThemThanhVienVaoNhieuNhom from "../screens/tinnhan-screens/ThemThanhVienVaoNhieuNhom";
//-------------------------------------
const Stack = createNativeStackNavigator();
export function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TrangChu"
      screenOptions={{
        headerStyle: { backgroundColor: "#0091FF" },
        headerTitle: "",
        headerShown: false,
        animationTypeForReplace: "pop",
        animation: "ios",
      }}>
      <Stack.Screen name="Tabs" component={TabsComponent} />
      <Stack.Screen
        name="TaiKhoanVaBaoMat"
        component={TaiKhoanVaBaoMat}
        options={{
          headerLeft: () => <CustomBackButton routeName="Tài khoản và bảo mật" />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="QuyenRiengTu"
        component={QuyenRiengTu}
        options={{
          headerLeft: () => <CustomBackButton routeName="Quyền riêng tư" />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CaiDat"
        component={CaiDat}
        options={{
          headerLeft: () => <CustomBackButton routeName="Cài đặt" />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{
          headerLeft: () => <CustomBackButton routeName="Name" />,
          headerShown: true,
        }}
      />
      <Stack.Screen name="ReelScreen" component={ReelScreen} />
      <Stack.Screen name="Button" component={Button} />
      <Stack.Screen name="TaoMatKhau" component={TaoMatKhau} />
      <Stack.Screen name="NhapTenNguoiDung" component={NhapTenNguoiDung} />
      <Stack.Screen name="ChonAnhDaiDien" component={ChonAnhDaiDien} />
      <Stack.Screen
        name="TrangChu"
        component={TrangChu}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="DangNhap"
        component={DangNhap}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Đăng nhập" />,
        }}
      />
      <Stack.Screen name="See" component={See} />
      <Stack.Screen
        name="NhapSoDienThoai"
        component={NhapSoDienThoai}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Đăng ký" />,
        }}
      />
      <Stack.Screen name="NhapMaXacThuc" component={NhapMaXacThuc} />
      <Stack.Screen name="NhapThongTinCaNhan" component={NhapThongTinCaNhan} />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route }) => ({
          headerLeft: () => <HeaderTinNhan conversationData1={route.params.conversationId} />,
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="DoiMatKhauScreen"
        component={DoiMatKhauScreen}
        options={{
          headerLeft: () => <CustomBackButton routeName="Đổi mật khẩu" />,
          headerShown: true,
        }}
      />
      <Stack.Screen name="DangNhapThanhCong" component={DangNhapThanhCong} />
      <Stack.Screen
        name="LayLaiMatKhau"
        component={LayLaiMatKhau}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Nhập số điện thoại" />,
        }}
      />
      <Stack.Screen name="MaXacThucLayLaiMatKhau" component={MaXacThucLayLaiMatKhau} />
      <Stack.Screen
        name="DanhBaMay"
        component={DanhBaMay}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Danh bạ máy" />,
        }}
      />
      <Stack.Screen
        name="LoiMoiKetBan"
        component={LoiMoiKetBan}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Lời mời kết bạn" />,
        }}
      />
      <Stack.Screen
        name="TimKiem"
        component={TimKiem}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton />,
          headerTitle: () => <SearchBarSelect />,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="TaoNhom"
        component={TaoNhom}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Nhóm mới" />,
          headerStyle: { backgroundColor: "gray" },
        }}
      />
      <Stack.Screen
        name="ChanhRecived"
        component={ChanhRecived}
        options={({ route }) => ({
          headerShown: true,
          headerLeft: () => <Header userData={route.params?.me} status={route.params?.status} />,
        })}
      />
      <Stack.Screen
        name="ChanhSender"
        component={ChanhSender}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Chanh sender" />,
        }}
      />
      <Stack.Screen
        name="ThongTinNhom"
        component={ThongTinNhom}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Tùy chọn" />,
        }}
      />
      <Stack.Screen
        name="ThanhVienNhom"
        component={ThanhVienNhom}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Thành viên" />,
        }}
      />
      <Stack.Screen
        name="TruongNhomMoi"
        component={TruongNhomMoi}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Chọn trưởng nhóm mới" />,
        }}
      />
      <Stack.Screen
        name="ChuyenTiep"
        component={ChuyenTiep}
        options={
          {
            // headerShown: true,
            // headerLeft: () => <CustomBackButton routeName="Chuyển tiếp" />,
          }
        }
      />
      <Stack.Screen
        name="ThemNhieuThanhVienVaoNhom"
        component={ThemNhieuThanhVienVaoNhom}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Thêm thành viên" />,
          headerStyle: { backgroundColor: "#A1A1A1" },
        }}
      />
      <Stack.Screen
        name="ThemThanhVienVaoNhieuNhom"
        component={ThemThanhVienVaoNhieuNhom}
        options={{
          headerShown: true,
          headerLeft: () => <CustomBackButton routeName="Thêm vào nhóm" />,
          headerStyle: { backgroundColor: "#A1A1A1" },
        }}
      />
    </Stack.Navigator>
  );
}
