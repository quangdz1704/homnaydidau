import {
  BREAKFAST_OPTIONS,
  DRINK_OPTIONS,
  FOOD_AND_DRINK_CATALOG,
  FOOD_OPTIONS,
} from "./food-and-drinks";
import type { Category } from "@/types";

export const PLAN_CHOICE_LIBRARY: Record<
  Category,
  { prompt: string; choices: string[]; searchQuery?: string }
> = {
  food: {
    prompt: "Hôm nay ăn gì?",
    choices: FOOD_OPTIONS,
    searchQuery: "quán ăn ngon",
  },
  cafe: {
    prompt: "Hôm nay uống gì?",
    choices: DRINK_OPTIONS,
    searchQuery: "quán cà phê đồ uống",
  },
  movie: {
    prompt: "Xem phim kiểu gì?",
    choices: [
      "Phim Việt đang chiếu",
      "Phim hài nhẹ nhàng",
      "Phim hoạt hình",
      "Phim kinh dị",
      "Phim hành động",
      "Phim tình cảm",
    ],
    searchQuery: "rạp chiếu phim",
  },
  outdoor: {
    prompt: "Ra ngoài làm gì?",
    choices: [
      "Đi dạo công viên",
      "Đi bộ quanh hồ",
      "Ngồi ghế đá hóng gió",
      "Đạp xe chậm",
      "Ngắm hoàng hôn",
      "Chụp vài tấm ảnh",
    ],
    searchQuery: "công viên địa điểm đi dạo",
  },
  creative: {
    prompt: "Làm gì bằng đôi tay?",
    choices: [
      "Tô tượng",
      "Làm gốm",
      "Vẽ tranh",
      "Làm vòng tay",
      "Chụp ảnh theo chủ đề",
      "Làm bánh",
    ],
    searchQuery: "workshop thủ công",
  },
  game: {
    prompt: "Chơi gì cho vui?",
    choices: [
      "Chơi game cùng nhau",
      "Bi-a",
      "Bowling",
      "Karaoke",
      "Trò chơi bàn",
      "Gắp thú",
    ],
    searchQuery: "khu vui chơi giải trí",
  },
  discover: {
    prompt: "Đi đâu khám phá?",
    choices: [
      "Bảo tàng",
      "Làng nghề",
      "Chợ địa phương",
      "Khu phố cũ",
      "Đền hoặc chùa",
      "Không gian văn hóa",
    ],
    searchQuery: "địa điểm tham quan",
  },
  chill: {
    prompt: "Nghỉ ngơi kiểu gì?",
    choices: [
      "Ngồi nghe nhạc",
      "Đọc sách",
      "Uống trà",
      "Tản bộ chậm",
      "Ngắm trời",
      "Viết vài dòng nhật ký",
    ],
  },
  active: {
    prompt: "Vận động môn gì?",
    choices: [
      "Đi bơi",
      "Cầu lông",
      "Pickleball",
      "Chạy bộ",
      "Đạp xe",
      "Tập gym theo buổi",
    ],
    searchQuery: "địa điểm thể thao",
  },
  learn: {
    prompt: "Học gì trong nửa tiếng?",
    choices: [
      "Một mẹo chụp ảnh",
      "Một món ăn dễ nấu",
      "Mười câu ngoại ngữ",
      "Một làn điệu dân gian",
      "Một kỹ năng tài chính",
      "Một câu chuyện lịch sử địa phương",
    ],
  },
  home: {
    prompt: "Ở nhà làm gì?",
    choices: [
      "Xem phim",
      "Nấu một món mới",
      "Chơi game",
      "Dọn lại góc phòng",
      "Ghép hình",
      "Nghe trọn một album",
    ],
  },
};

export function choicesForActivity(title: string, category: Category) {
  const normalized = title.toLowerCase();
  if (normalized.includes("bún đậu"))
    return {
      prompt: "Gọi mẹt nào?",
      choices: [
        "Mẹt đầy đủ chả cốm, nem rán và thịt luộc",
        "Mẹt nhỏ vừa bụng",
        "Mẹt thêm lòng dồi",
        "Mẹt chay nhẹ nhàng",
      ],
      searchQuery: "bún đậu mắm tôm",
    };
  if (normalized.includes("bún chả"))
    return {
      prompt: "Gọi suất nào?",
      choices: [
        "Bún chả truyền thống",
        "Bún chả thêm nem cua bể",
        "Bún chả kèm chả lá lốt",
        "Suất bún chả đầy đặn",
      ],
      searchQuery: "bún chả ngon",
    };
  if (normalized.includes("lẩu"))
    return {
      prompt: "Chọn nồi lẩu nào?",
      choices: ["Lẩu riêu cua", "Lẩu Thái chua cay", "Lẩu ếch", "Lẩu kim chi"],
      searchQuery: "quán lẩu ngon",
    };
  if (normalized.includes("đồ nướng"))
    return {
      prompt: "Nướng gì đây?",
      choices: ["Ba chỉ bò Mỹ", "Gà nướng mật ong", "Hàu nướng mỡ hành", "Set nướng thập cẩm"],
      searchQuery: "quán nướng than hoa",
    };
  if (normalized.includes("ăn sáng"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Bữa sáng ăn gì?",
      choices: BREAKFAST_OPTIONS,
    };
  if (normalized.includes("ăn vặt") || normalized.includes("đồ ngọt"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Chọn món ăn vặt",
      choices: FOOD_AND_DRINK_CATALOG.lightSnacks.map((item) => item.name),
    };
  if (normalized.includes("món nhật"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Chọn món Nhật",
      choices: FOOD_AND_DRINK_CATALOG.japanese.map((item) => item.name),
    };
  if (normalized.includes("món hàn"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Chọn món Hàn",
      choices: FOOD_AND_DRINK_CATALOG.korean.map((item) => item.name),
    };
  if (normalized.includes("món thái"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Chọn món Thái",
      choices: FOOD_AND_DRINK_CATALOG.thai.map((item) => item.name),
    };
  if (normalized.includes("món trung"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Chọn món Trung",
      choices: FOOD_AND_DRINK_CATALOG.chinese.map((item) => item.name),
    };
  if (normalized.includes("kinh bắc"))
    return {
      ...PLAN_CHOICE_LIBRARY.food,
      prompt: "Chọn đặc sản Kinh Bắc",
      choices: FOOD_AND_DRINK_CATALOG.bacNinhSpecialties.map(
        (item) => item.name,
      ),
    };
  if (normalized.includes("đi bơi"))
    return {
      prompt: "Chọn kiểu bể bơi",
      choices: ["Bể bơi bốn mùa", "Bể bơi trong nhà", "Bể bơi ngoài trời"],
      searchQuery: "bể bơi",
    };
  if (normalized.includes("siêu thị"))
    return {
      prompt: "Đi siêu thị làm gì?",
      choices: [
        "Mua đồ nấu bữa tối",
        "Săn đồ ăn vặt",
        "Mua hoa quả",
        "Tìm một món chưa thử",
      ],
      searchQuery: "siêu thị",
    };
  if (normalized.includes("bi-a"))
    return {
      prompt: "Chơi kiểu nào?",
      choices: ["Pool 8 bi", "Pool 9 bi", "Chơi vui tính giờ"],
      searchQuery: "quán bi-a",
    };
  if (normalized.includes("karaoke"))
    return {
      prompt: "Mở màn bằng bài gì?",
      choices: [
        "Nhạc Việt 8x–9x",
        "Nhạc trẻ",
        "Bolero",
        "Nhạc phim",
        "Một bài tủ",
      ],
      searchQuery: "quán karaoke",
    };
  if (normalized.includes("chơi game cùng nhau") || normalized.includes("chơi game tại nhà"))
    return {
      prompt: "Chơi game nào?",
      choices: ["Overcooked! 2", "It Takes Two", "Mario Kart", "FC Online", "Moving Out"],
    };
  if (normalized.includes("trò chơi bàn"))
    return {
      prompt: "Chọn board game nào?",
      choices: ["Ma Sói", "Uno", "Catan", "Ticket to Ride", "Exploding Kittens"],
      searchQuery: "quán board game",
    };
  if (normalized.includes("phòng giải đố"))
    return {
      prompt: "Chọn chủ đề phòng nào?",
      choices: ["Vụ án bí ẩn", "Thoát khỏi nhà tù", "Lời nguyền cổ xưa", "Phòng thí nghiệm"],
      searchQuery: "escape room",
    };
  if (normalized.includes("gắp thú"))
    return {
      prompt: "Săn món nào?",
      choices: ["Gấu bông nhỏ", "Móc khoá dễ thương", "Blind box", "Đặt mục tiêu 3 lần gắp"],
      searchQuery: "khu trò chơi gắp thú",
    };
  return PLAN_CHOICE_LIBRARY[category];
}
