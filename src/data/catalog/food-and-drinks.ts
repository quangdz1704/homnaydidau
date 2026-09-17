export interface MenuOption {
  name: string;
  emoji: string;
  image?: string;
}

export const FOOD_AND_DRINK_CATALOG = {
  lightSnacks: [
    { name: "Nem chua rán", emoji: "🍢", image: "/assets/catalog/food/nem-chua-ran.webp" },
    { name: "Bánh tráng trộn", emoji: "🥗", image: "/assets/catalog/food/banh-trang-tron.webp" },
    { name: "Khoai tây lắc", emoji: "🍟", image: "/assets/catalog/food/khoai-tay-lac.webp" },
    { name: "Chân gà sả tắc", emoji: "🍗", image: "/assets/catalog/food/chan-ga-sa-tac.webp" },
    { name: "Ốc luộc, ốc xào", emoji: "🐚", image: "/assets/catalog/food/oc-luoc-xao.webp" },
    { name: "Xiên nướng vỉa hè", emoji: "🍡", image: "/assets/catalog/food/xien-nuong.webp" },
    { name: "Bánh gối", emoji: "🥟", image: "/assets/catalog/food/banh-goi.webp" },
    { name: "Bánh rán mặn", emoji: "🥯", image: "/assets/catalog/food/banh-ran-man.webp" },
    { name: "Tào phớ", emoji: "🥣", image: "/assets/catalog/food/tao-pho.webp" },
    { name: "Chè thập cẩm", emoji: "🍧", image: "/assets/catalog/food/che-thap-cam.webp" },
    { name: "Sữa chua nếp cẩm", emoji: "🥛", image: "/assets/catalog/food/sua-chua-nep-cam.webp" },
    { name: "Hoa quả dầm", emoji: "🍓", image: "/assets/catalog/food/hoa-qua-dam.webp" },
    { name: "Kem", emoji: "🍨", image: "/assets/catalog/food/kem.webp" },
  ],
  drinks: [
    { name: "Cà phê nâu đá", emoji: "☕", image: "/assets/catalog/drinks/ca-phe-nau-da.webp" },
    { name: "Bạc xỉu", emoji: "🥛", image: "/assets/catalog/drinks/bac-xiu.webp" },
    { name: "Cà phê muối", emoji: "🧂", image: "/assets/catalog/drinks/ca-phe-muoi.webp" },
    { name: "Trà chanh", emoji: "🍋", image: "/assets/catalog/drinks/tra-chanh.webp" },
    { name: "Trà sen", emoji: "🪷", image: "/assets/catalog/drinks/tra-sen.webp" },
    { name: "Trà đào cam sả", emoji: "🍑", image: "/assets/catalog/drinks/tra-dao-cam-sa.webp" },
    { name: "Trà sữa", emoji: "🧋", image: "/assets/catalog/drinks/tra-sua.webp" },
    { name: "Matcha latte", emoji: "🍵", image: "/assets/catalog/drinks/matcha-latte.webp" },
    { name: "Matcha nước dừa", emoji: "🥥", image: "/assets/catalog/drinks/matcha-nuoc-dua.webp" },
    { name: "Nước sấu", emoji: "🫒", image: "/assets/catalog/drinks/nuoc-sau.webp" },
    { name: "Nước mía", emoji: "🥤", image: "/assets/catalog/drinks/nuoc-mia.webp" },
    { name: "Sinh tố hoa quả", emoji: "🥭", image: "/assets/catalog/drinks/sinh-to-hoa-qua.webp" },
  ],
  quickMeals: [
    { name: "Bánh mì chảo", emoji: "🍳", image: "/assets/catalog/food/banh-mi-chao.webp" },
    { name: "Bánh mì thịt", emoji: "🥖", image: "/assets/catalog/food/banh-mi-thit.webp" },
    { name: "Xôi mặn", emoji: "🍚", image: "/assets/catalog/food/xoi-man.webp" },
    { name: "Mì trộn", emoji: "🍜", image: "/assets/catalog/food/mi-tron.webp" },
    { name: "Cơm cuộn", emoji: "🍙", image: "/assets/catalog/food/com-cuon.webp" },
    { name: "Gà rán", emoji: "🍗", image: "/assets/catalog/food/ga-ran.webp" },
    { name: "Pizza", emoji: "🍕", image: "/assets/catalog/food/pizza.webp" },
    { name: "Hamburger", emoji: "🍔", image: "/assets/catalog/food/hamburger.webp" },
    { name: "Phở cuốn", emoji: "🥬", image: "/assets/catalog/food/pho-cuon.webp" },
  ],
  vietnameseMeals: [
    { name: "Phở bò", emoji: "🍜", image: "/assets/catalog/food/pho-bo.webp" },
    { name: "Bún chả", emoji: "🥢", image: "/assets/catalog/food/bun-cha.webp" },
    { name: "Bún đậu mắm tôm", emoji: "🧺", image: "/assets/catalog/food/bun-dau-mam-tom.webp" },
    { name: "Bánh cuốn", emoji: "🥟", image: "/assets/catalog/food/banh-cuon.webp" },
    { name: "Bún riêu cua", emoji: "🦀", image: "/assets/catalog/food/bun-rieu-cua.webp" },
    { name: "Miến lươn", emoji: "🍲", image: "/assets/catalog/food/mien-luon.webp" },
    { name: "Cơm rang dưa bò", emoji: "🍛", image: "/assets/catalog/food/com-rang-dua-bo.webp" },
    { name: "Cơm niêu", emoji: "🍚", image: "/assets/catalog/food/com-nieu.webp" },
    { name: "Lẩu riêu cua", emoji: "🍲", image: "/assets/catalog/food/lau.webp" },
    { name: "Lẩu ếch", emoji: "🍲", image: "/assets/catalog/food/lau.webp" },
    { name: "Đồ nướng than hoa", emoji: "🥩", image: "/assets/catalog/food/do-nuong-than-hoa.webp" },
    { name: "Dê núi", emoji: "🍖", image: "/assets/catalog/food/de-nui.webp" },
  ],
  bacNinhSpecialties: [
    { name: "Nem Bùi", emoji: "🌿", image: "/assets/catalog/food/nem-bui.webp" },
    { name: "Bánh phu thê Đình Bảng", emoji: "🎁", image: "/assets/catalog/food/banh-phu-the-dinh-bang.webp" },
    { name: "Bánh tẻ làng Chờ", emoji: "🍃", image: "/assets/catalog/food/banh-te-lang-cho.webp" },
    { name: "Bánh khúc làng Diềm", emoji: "🥮", image: "/assets/catalog/food/banh-khuc-lang-diem.webp" },
  ],
  japanese: [
    { name: "Sushi và sashimi", emoji: "🍣", image: "/assets/catalog/food/sushi-sashimi.webp" },
    { name: "Ramen", emoji: "🍜", image: "/assets/catalog/food/ramen.webp" },
    { name: "Udon", emoji: "🍜", image: "/assets/catalog/food/udon.webp" },
    { name: "Cơm bò Nhật", emoji: "🍚", image: "/assets/catalog/food/com-bo-nhat.webp" },
    { name: "Xiên nướng yakitori", emoji: "🍢", image: "/assets/catalog/food/xien-nuong-yakitori.webp" },
  ],
  korean: [
    { name: "Thịt nướng Hàn Quốc", emoji: "🥩", image: "/assets/catalog/food/thit-nuong-han-quoc.webp" },
    { name: "Gà rán Hàn Quốc", emoji: "🍗", image: "/assets/catalog/food/ga-ran-han-quoc.webp" },
    { name: "Tokbokki", emoji: "🌶️", image: "/assets/catalog/food/tokbokki.webp" },
    { name: "Cơm trộn bibimbap", emoji: "🍚", image: "/assets/catalog/food/com-tron-bibimbap.webp" },
    { name: "Canh kim chi", emoji: "🍲", image: "/assets/catalog/food/canh-kim-chi.webp" },
  ],
  thai: [
    { name: "Lẩu Thái", emoji: "🍲", image: "/assets/catalog/food/lau-thai.webp" },
    { name: "Tom yum", emoji: "🦐", image: "/assets/catalog/food/tom-yum.webp" },
    { name: "Pad Thái", emoji: "🍝", image: "/assets/catalog/food/pad-thai.webp" },
    { name: "Gỏi đu đủ Thái", emoji: "🥗", image: "/assets/catalog/food/goi-du-du-thai.webp" },
    { name: "Cơm rang dứa", emoji: "🍍", image: "/assets/catalog/food/com-rang-dua.webp" },
  ],
  chinese: [
    { name: "Dimsum", emoji: "🥟", image: "/assets/catalog/food/dimsum.webp" },
    { name: "Vịt quay", emoji: "🦆", image: "/assets/catalog/food/vit-quay.webp" },
    { name: "Mì bò Đài Loan", emoji: "🍜", image: "/assets/catalog/food/mi-bo-dai-loan.webp" },
    { name: "Lẩu Tứ Xuyên", emoji: "🌶️", image: "/assets/catalog/food/lau-tu-xuyen.webp" },
    { name: "Cơm rang Dương Châu", emoji: "🍛", image: "/assets/catalog/food/com-rang-duong-chau.webp" },
  ],
} satisfies Record<string, MenuOption[]>;

export const BREAKFAST_OPTIONS = [
  "Phở bò",
  "Bánh cuốn",
  "Xôi mặn",
  "Bún riêu cua",
  "Bánh mì chảo",
  "Bánh tẻ làng Chờ",
  "Cháo sườn",
  "Miến lươn",
];

export const FOOD_OPTIONS = Object.entries(FOOD_AND_DRINK_CATALOG)
  .filter(([group]) => group !== "drinks")
  .flatMap(([, options]) => options)
  .map((item) => item.name);

export const DRINK_OPTIONS = FOOD_AND_DRINK_CATALOG.drinks.map(
  (item) => item.name,
);
