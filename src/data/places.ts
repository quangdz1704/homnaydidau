import type { Category, CityKey, TrendSuggestion } from "@/types";

export interface CityOption {
  value: CityKey;
  label: string;
  shortLabel: string;
  emoji: string;
  center: { latitude: number; longitude: number };
  searchRadiusMeters: number;
}

export const CITY_OPTIONS: CityOption[] = [
  {
    value: "bacninh",
    label: "Bắc Ninh",
    shortLabel: "Bắc Ninh",
    emoji: "🎶",
    center: { latitude: 21.1861, longitude: 106.0763 },
    searchRadiusMeters: 18_000,
  },
  {
    value: "hanoi",
    label: "Hà Nội",
    shortLabel: "Hà Nội",
    emoji: "🏛️",
    center: { latitude: 21.0285, longitude: 105.8542 },
    searchRadiusMeters: 25_000,
  },
  {
    value: "hcm",
    label: "TP. Hồ Chí Minh",
    shortLabel: "Sài Gòn",
    emoji: "🌆",
    center: { latitude: 10.7769, longitude: 106.7009 },
    searchRadiusMeters: 25_000,
  },
  {
    value: "danang",
    label: "Đà Nẵng",
    shortLabel: "Đà Nẵng",
    emoji: "🌊",
    center: { latitude: 16.0544, longitude: 108.2022 },
    searchRadiusMeters: 22_000,
  },
];

const LOCAL_TRENDS: TrendSuggestion[] = [
  {
    id: "bn-nguyen-van-cu-park",
    image: "/assets/catalog/places/nguyen-van-cu-park.webp",
    title: "Dạo công viên Nguyễn Văn Cừ",
    emoji: "🌳",
    description: "Đi bộ, ngồi ghế đá hoặc vận động nhẹ ngay trong thành phố.",
    query: "Công viên Nguyễn Văn Cừ Bắc Ninh",
    categories: ["outdoor", "active", "chill"],
    cities: ["bacninh"],
  },
  {
    id: "bn-quan-ho",
    image: "/assets/catalog/places/quan-ho.webp",
    title: "Không gian Quan họ Kinh Bắc",
    emoji: "🎶",
    description:
      "Tìm một buổi diễn hoặc không gian văn hóa để nghe trọn một làn điệu Quan họ.",
    query: "Nhà hát Dân ca Quan họ Bắc Ninh",
    categories: ["discover", "learn", "chill"],
    cities: ["bacninh"],
  },
  {
    id: "bn-den-do",
    title: "Đền Đô và Đình Bảng",
    emoji: "⛩️",
    description:
      "Một chuyến đi gần, hợp để tìm hiểu lịch sử và ăn bánh phu thê.",
    query: "Đền Đô Đình Bảng Bắc Ninh",
    image: "/assets/catalog/places/den-do.webp",
    categories: ["discover", "outdoor", "learn"],
    cities: ["bacninh"],
  },
  {
    id: "bn-dong-ho",
    image: "/assets/catalog/places/dong-ho.webp",
    title: "Làng tranh Đông Hồ",
    emoji: "🖼️",
    description:
      "Xem tranh dân gian, tìm hiểu cách in tranh và chọn một món nhỏ mang về.",
    query: "Làng tranh Đông Hồ Bắc Ninh",
    categories: ["discover", "creative", "learn"],
    cities: ["bacninh"],
  },
  {
    id: "bn-phu-lang",
    image: "/assets/catalog/places/phu-lang.webp",
    title: "Làng gốm Phù Lãng",
    emoji: "🏺",
    description: "Dạo làng nghề, ngắm đồ gốm và thử một trải nghiệm thủ công.",
    query: "Làng gốm Phù Lãng Bắc Ninh",
    categories: ["discover", "creative", "learn"],
    cities: ["bacninh"],
  },
  {
    id: "bn-pagodas",
    image: "/assets/catalog/places/pagodas.webp",
    title: "Chùa Dâu hoặc chùa Phật Tích",
    emoji: "🪷",
    description: "Đi chậm, giữ yên tĩnh và dành thời gian ngắm kiến trúc cổ.",
    query: "chùa Dâu chùa Phật Tích Bắc Ninh",
    categories: ["discover", "outdoor", "chill"],
    cities: ["bacninh"],
  },
  {
    id: "bn-food",
    image: "/assets/catalog/places/kinh-bac-food.webp",
    title: "Ăn một món Kinh Bắc",
    emoji: "🎁",
    description:
      "Tìm nem Bùi, bánh tẻ làng Chờ, bánh khúc làng Diềm hoặc bánh phu thê.",
    query: "đặc sản Kinh Bắc ngon Bắc Ninh",
    categories: ["food", "discover"],
    cities: ["bacninh"],
  },
  {
    id: "hn-hoan-kiem",
    image: "/assets/catalog/places/hoan-kiem.webp",
    title: "Một vòng Hồ Gươm",
    emoji: "🌿",
    description:
      "Đi bộ quanh hồ, ghé đền Ngọc Sơn và ăn một que kem Tràng Tiền.",
    query: "Hồ Hoàn Kiếm phố đi bộ",
    categories: ["outdoor", "chill", "discover"],
    cities: ["hanoi"],
  },
  {
    id: "hn-west-lake",
    image: "/assets/catalog/places/ho-tay.webp",
    title: "Dạo Hồ Tây",
    emoji: "🌊",
    description: "Đi bộ hoặc đạp xe ven hồ, dừng uống nước và ngắm hoàng hôn.",
    query: "địa điểm đi dạo ngắm hoàng hôn Hồ Tây",
    categories: ["outdoor", "active", "chill"],
    cities: ["hanoi"],
  },
  {
    id: "hn-old-quarter",
    image: "/assets/catalog/places/pho-co.webp",
    title: "Phố cổ và món ngon Hà Nội",
    emoji: "🏘️",
    description: "Đi bộ qua vài phố nghề rồi thử bún chả, phở hoặc bánh cuốn.",
    query: "món ngon phố cổ Hà Nội",
    categories: ["food", "discover"],
    cities: ["hanoi"],
  },
  {
    id: "hn-thong-nhat",
    image: "/assets/catalog/places/thong-nhat.webp",
    title: "Công viên Thống Nhất",
    emoji: "🌳",
    description: "Đi bộ, chạy nhẹ hoặc ngồi nghỉ giữa một khoảng xanh rộng.",
    query: "Công viên Thống Nhất Hà Nội",
    categories: ["outdoor", "active", "chill"],
    cities: ["hanoi"],
  },
  {
    id: "hn-museum",
    image: "/assets/catalog/places/ethnology-museum.webp",
    title: "Bảo tàng Dân tộc học",
    emoji: "🏛️",
    description:
      "Tìm hiểu đời sống và văn hóa của cộng đồng các dân tộc Việt Nam.",
    query: "Bảo tàng Dân tộc học Việt Nam",
    categories: ["discover", "learn"],
    cities: ["hanoi"],
  },
  {
    id: "hn-bat-trang",
    image: "/assets/catalog/places/bat-trang.webp",
    title: "Một buổi ở Bát Tràng",
    emoji: "🏺",
    description: "Dạo làng gốm, thử nặn gốm và tìm một món đồ thủ công.",
    query: "làng gốm Bát Tràng trải nghiệm",
    categories: ["discover", "creative", "learn"],
    cities: ["hanoi"],
  },
];

const VIETNAMESE_TRENDS: TrendSuggestion[] = [
  {
    id: "salt-coffee",
    image: "/assets/catalog/drinks/ca-phe-muoi.webp",
    title: "Cà phê muối",
    emoji: "☕",
    description:
      "Một lựa chọn dễ thử, hợp cả khi đi một mình lẫn ngồi chuyện trò.",
    query: "quán cà phê muối được đánh giá cao",
    categories: ["cafe", "food"],
  },
  {
    id: "matcha-coconut",
    image: "/assets/catalog/drinks/matcha-nuoc-dua.webp",
    title: "Matcha nước dừa",
    emoji: "🍵",
    description:
      "Vị trà xanh kết hợp nước dừa đang được nhiều quán đưa vào thực đơn.",
    query: "matcha nước dừa ngon",
    categories: ["cafe", "food"],
  },
  {
    id: "vietnamese-snacks",
    image: "/assets/catalog/food/snacks.webp",
    title: "Quán ăn vặt Việt Nam",
    emoji: "🍢",
    description: "Nem chua rán, bánh gối, chân gà, ốc hoặc một cốc chè mát.",
    query: "quán ăn vặt ngon đông khách",
    categories: ["food"],
  },
  {
    id: "hotpot-grill",
    image: "/assets/catalog/food/lau.webp",
    title: "Lẩu hoặc nướng",
    emoji: "🍲",
    description: "Hợp cho buổi tối và nhóm từ hai người trở lên.",
    query: "quán lẩu nướng ngon nhiều đánh giá",
    categories: ["food"],
  },
  {
    id: "asian-food",
    image: "/assets/catalog/food/sushi-sashimi.webp",
    title: "Món Nhật, Hàn, Thái hoặc Trung",
    emoji: "🥢",
    description:
      "Đổi vị nhưng vẫn dễ tìm ở khu trung tâm và trung tâm thương mại.",
    query: "nhà hàng châu Á ngon nhiều đánh giá",
    categories: ["food"],
  },
  {
    id: "garden-cafe",
    image: "/assets/catalog/food/sushi-sashimi.webp",
    title: "Cà phê sân vườn",
    emoji: "🌿",
    description: "Không gian thoáng, dễ ngồi lâu và nói chuyện.",
    query: "quán cà phê sân vườn yên tĩnh",
    categories: ["cafe", "chill"],
  },
  {
    id: "book-cafe",
    image: "/assets/catalog/drinks/ca-phe-nau-da.webp",
    title: "Cà phê sách yên tĩnh",
    emoji: "📚",
    description: "Hợp để đọc sách, làm việc nhẹ hoặc ngồi một mình.",
    query: "quán cà phê sách yên tĩnh",
    categories: ["cafe", "learn", "chill"],
  },
  {
    id: "lemon-tea",
    image: "/assets/catalog/drinks/tra-chanh.webp",
    title: "Trà chanh và đồ ăn vặt",
    emoji: "🍋",
    description: "Một kèo bình dân, dễ rủ bạn và ngồi nói chuyện lâu.",
    query: "quán trà chanh đồ ăn vặt đông khách",
    categories: ["cafe", "food"],
  },
  {
    id: "cinema",
    image: "/assets/catalog/activities/xem-phim-rap.webp",
    title: "Xem phim ngoài rạp",
    emoji: "🎬",
    description: "Tìm rạp gần nhất, so suất chiếu và chọn phim hợp tâm trạng.",
    query: "rạp chiếu phim gần đây",
    categories: ["movie"],
  },
  {
    id: "vietnamese-movie",
    image: "/assets/catalog/activities/xem-lai-phim-viet.webp",
    title: "Chọn một phim Việt đang chiếu",
    emoji: "🎞️",
    description: "Xem lịch chiếu và chọn phim Việt có giờ phù hợp nhất.",
    query: "rạp chiếu phim phim Việt đang chiếu",
    categories: ["movie"],
  },
  {
    id: "cinema-couple-seat",
    image: "/assets/catalog/activities/xem-lai-phim-viet.webp",
    title: "Rạp có ghế đôi",
    emoji: "💺",
    description: "Hợp cho buổi hẹn nhẹ nhàng và không cần lên kế hoạch cầu kỳ.",
    query: "rạp chiếu phim ghế đôi được đánh giá cao",
    categories: ["movie"],
  },
  {
    id: "cinema-mall",
    image: "/assets/catalog/activities/xem-phim-rap.webp",
    title: "Xem phim rồi dạo trung tâm thương mại",
    emoji: "🍿",
    description: "Gộp xem phim, ăn tối và đi dạo trong cùng một điểm.",
    query: "rạp chiếu phim trong trung tâm thương mại",
    categories: ["movie", "discover"],
  },
  {
    id: "swimming",
    image: "/assets/catalog/activities/di-boi.webp",
    title: "Đi bơi",
    emoji: "🏊",
    description: "Ưu tiên bể sạch, có nhiều đánh giá và giờ mở cửa phù hợp.",
    query: "bể bơi sạch nhiều đánh giá",
    categories: ["active"],
  },
  {
    id: "sports",
    image: "/assets/catalog/activities/danh-cau-long.webp",
    title: "Cầu lông hoặc pickleball",
    emoji: "🏸",
    description: "Thuê sân theo giờ và vận động vừa sức.",
    query: "sân cầu lông pickleball",
    categories: ["active", "game"],
  },
  {
    id: "day-gym",
    image: "/assets/catalog/activities/tap-gym.png",
    title: "Phòng tập có vé theo buổi",
    emoji: "🏋️",
    description: "Tập vừa sức, ưu tiên nơi có phòng thay đồ và đánh giá tốt.",
    query: "phòng gym vé tập ngày",
    categories: ["active"],
  },
  {
    id: "park-running",
    image: "/assets/catalog/activities/chay-bo.png",
    title: "Chạy bộ hoặc đi bộ nhanh",
    emoji: "🏃",
    description: "Chọn công viên hoặc đường ven hồ dễ đi và có ánh sáng.",
    query: "công viên đường chạy bộ",
    categories: ["active", "outdoor"],
  },
  {
    id: "park-walk",
    image: "/assets/catalog/activities/chay-bo-an-sang.webp",
    title: "Công viên gần nhà",
    emoji: "🌳",
    description: "Một lựa chọn miễn phí để đi dạo, ngồi nghỉ và hít thở.",
    query: "công viên gần đây nhiều cây xanh",
    categories: ["outdoor", "chill"],
  },
  {
    id: "sunset-place",
    image: "/assets/catalog/places/ho-tay.webp",
    title: "Chỗ ngắm hoàng hôn",
    emoji: "🌅",
    description:
      "Tìm hồ, công viên hoặc không gian thoáng và đến sớm một chút.",
    query: "địa điểm ngắm hoàng hôn đẹp",
    categories: ["outdoor", "chill"],
  },
  {
    id: "supermarket",
    image: "/assets/catalog/activities/di-sieu-thi.webp",
    title: "Đi siêu thị rồi nấu ăn",
    emoji: "🛒",
    description:
      "Mua nguyên liệu cho một bữa đơn giản và tìm thêm một món ăn vặt mới.",
    query: "siêu thị gần đây",
    categories: ["discover", "home"],
  },
  {
    id: "karaoke-billiards",
    image: "/assets/catalog/activities/hat-karaoke.webp",
    title: "Karaoke hoặc bi-a",
    emoji: "🎤",
    description: "Một kèo quen thuộc, dễ rủ bạn và không cần chuẩn bị nhiều.",
    query: "karaoke bi-a được đánh giá cao",
    categories: ["game"],
  },
  {
    id: "bowling-arcade",
    image: "/assets/catalog/activities/choi-bowling.webp",
    title: "Bowling hoặc khu trò chơi",
    emoji: "🎳",
    description: "Hợp nhóm bạn, có thể chơi theo lượt và dừng bất cứ lúc nào.",
    query: "bowling khu vui chơi trong nhà",
    categories: ["game", "active"],
  },
  {
    id: "tabletop-games",
    image: "/assets/catalog/activities/choi-tro-choi-ban.webp",
    title: "Quán trò chơi bàn",
    emoji: "🎲",
    description: "Chọn trò dễ học và nhờ nhân viên hướng dẫn luật.",
    query: "quán board game trò chơi bàn",
    categories: ["game", "cafe"],
  },
  {
    id: "handcraft",
    image: "/assets/catalog/places/phu-lang.webp",
    title: "Làm gốm, tô tượng hoặc vẽ tranh",
    emoji: "🎨",
    description: "Tự làm một món nhỏ và có thành phẩm mang về.",
    query: "workshop thủ công làm gốm tô tượng",
    categories: ["creative", "learn"],
  },
  {
    id: "baking-class",
    image: "/assets/catalog/food/banh-mi-chao.webp",
    title: "Lớp làm bánh ngắn",
    emoji: "🧁",
    description: "Học một công thức dễ và mang thành phẩm về sau buổi học.",
    query: "lớp workshop làm bánh theo buổi",
    categories: ["creative", "learn"],
  },
  {
    id: "painting-workshop",
    image: "/assets/catalog/food/banh-mi-chao.webp",
    title: "Buổi vẽ tranh thư giãn",
    emoji: "🖌️",
    description: "Không cần biết vẽ; chỉ cần chọn màu và làm theo cảm hứng.",
    query: "workshop vẽ tranh thư giãn",
    categories: ["creative", "chill"],
  },
  {
    id: "local-market",
    image: "/assets/catalog/activities/dao-cho-dia-phuong.webp",
    title: "Dạo chợ địa phương",
    emoji: "🛍️",
    description: "Xem đồ tươi, món ăn quen và nhịp sống của khu dân cư.",
    query: "chợ địa phương gần đây",
    categories: ["discover", "food"],
  },
  {
    id: "local-museum",
    image: "/assets/catalog/places/ethnology-museum.webp",
    title: "Bảo tàng hoặc nhà truyền thống",
    emoji: "🏛️",
    description: "Một nơi dễ đi để hiểu thêm lịch sử và văn hóa địa phương.",
    query: "bảo tàng nhà truyền thống địa phương",
    categories: ["discover", "learn"],
  },
  {
    id: "bookstore",
    image: "/assets/catalog/activities/di-nha-sach.webp",
    title: "Nhà sách hoặc thư viện",
    emoji: "📚",
    description:
      "Một lựa chọn nhẹ nhàng cho ngày muốn ra ngoài nhưng không quá ồn.",
    query: "nhà sách thư viện gần đây",
    categories: ["learn", "chill"],
  },
];

export function getAllPlaceSuggestions() {
  return [...LOCAL_TRENDS, ...VIETNAMESE_TRENDS];
}

export function getCity(value: CityKey) {
  return CITY_OPTIONS.find((city) => city.value === value) ?? CITY_OPTIONS[0];
}

export function getTrendSuggestions(
  category: Category,
  city: CityKey,
  limit = 4,
) {
  const local = LOCAL_TRENDS.filter(
    (trend) =>
      trend.cities?.includes(city) && trend.categories.includes(category),
  );
  const general = VIETNAMESE_TRENDS.filter((trend) =>
    trend.categories.includes(category),
  );
  return [...local, ...general].slice(0, limit);
}
