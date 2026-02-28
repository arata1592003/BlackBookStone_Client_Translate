import { RuleType } from "./translate.type";

// 1. QUY TẮC TRÍCH XUẤT CỐ ĐỊNH (Luôn áp dụng cho Advance)
export const FIXED_EXTRACTION_RULES = `
### QUY TẮC TRÍCH XUẤT VÀ CHUẨN HÓA
- Chỉ liệt kê nhân vật hoặc thuật ngữ mới xuất hiện hoặc có thông tin mới.
- Chuẩn hóa cách gọi, trật tự, và ngữ pháp cho tên, cảnh giới, pháp khí.
- Ghi phẩm chất vào trường "quality_level" (VD: "thượng phẩm").
- Viết hoa từng chữ cho công pháp, địa danh (Capitalized Form).
- Dùng dấu ngoặc đơn ('...') trong mô tả thay vì ngoặc kép.
- Câu thoại nhân vật phải ở dạng "nội dung", không dùng ký tự lạ.
`;

// 2. QUY TẮC TỔNG HỢP CỐ ĐỊNH (Luôn áp dụng cho Advance)
export const FIXED_SYNTHESIS_RULES = `
### QUY TẮC TỔNG HỢP DỮ LIỆU
- Phân tích chương mới và tổng hợp: CharacterRelations, Relations, TermGlossary.
- Cập nhật dữ liệu cũ: Ưu tiên dữ liệu cũ nếu thông tin mới chưa rõ ràng.
- Đảm bảo thống nhất cách xưng hô xuyên suốt các chương.
- Các trường description, speech_style phải cực kỳ ngắn gọn, 1-2 câu.
`;

// 3. CÁC MẢNH GHÉP DỊCH THUẬT MẪU (Cho người dùng chọn)
export const TRANSLATION_SNIPPETS = [
  {
    id: "snip-danh-xung",
    name: "Danh xưng Tiên Hiệp",
    content: "Viết danh xưng theo thứ tự: Tên + Danh xưng (VD: Trương trưởng lão, Trương tông chủ). Giữ nguyên ngôi kể: hắn, nàng, y, lão quái vật. Giữ nguyên danh xưng Hán Việt (Hắc Bào Yêu Thánh, Xà Yêu Vương)."
  },
  {
    id: "snip-canh-gioi",
    name: "Cảnh giới & Chữ số",
    content: "Giữ nguyên Kim Đan kỳ. Đảo ngữ: cảnh giới Kim Đan. Đổi chữ số Hán (nhị, tam...) thành số Việt (hai, ba...). Kim Đan kỳ ngũ tầng -> Kim Đan kỳ tầng năm."
  },
  {
    id: "snip-vat-pham",
    name: "Vật phẩm & Phẩm chất",
    content: "Đảo vị trí: <Tên vật phẩm> + <Phẩm chất>. Ví dụ: hạ phẩm Linh Thạch -> Linh Thạch hạ phẩm."
  },
  {
    id: "snip-gia-toc",
    name: "Gia tộc & Chủng tộc",
    content: "Gia tộc: Họ + gia (VD: Công Tôn gia). Chủng tộc 2 âm tiết: tộc + Tên (VD: tộc Tinh Linh). Hán Việt hóa yêu thú (rắn yêu -> xà yêu)."
  },
  {
    id: "snip-ngu-phap",
    name: "Ngữ pháp thuần Việt",
    content: "Cấu trúc câu chuẩn Việt: Sắc mặt Tô Mặc trắng bệch. Đảo sở hữu: tu sĩ Nhân tộc, gia chủ Lưu gia."
  },
  {
    id: "snip-co-kinh",
    name: "Phong vị cổ kính",
    content: "Dùng từ cổ kính: cha mẹ -> phụ mẫu, cha -> phụ thân, con bé -> nha đầu. Tên tiếng Anh viết theo âm Việt (Gordon -> Cát Đốn)."
  }
];
