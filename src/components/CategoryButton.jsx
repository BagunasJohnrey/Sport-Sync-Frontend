import * as Icons from "lucide-react";

const iconMap = {
  All: "Package",
  Footwear: "Footprints",
  Balls: "CircleDot",
  Apparel: "Shirt",
  Accessories: "Package",
  "Fitness Equipment": "Dumbbell",
};

export default function CategoryButton({ categories, active, onSelect }) {

  const allCategories = [{ id: 0, category_name: "All" }, ...categories];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {allCategories.map((cat) => {
        const Icon = Icons[iconMap[cat.category_name]] || Icons.Tag;
        const isActive = active === cat.category_name;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.category_name)}
            className={`
              flex flex-col items-center justify-center
              w-24 sm:w-28 md:w-32 h-20 min-w-20 p-2
              rounded-xl border text-xs
              transition
              ${isActive 
                ? "bg-navyBlue text-softWhite border-gray-300 shadow-md" 
                : "bg-softWhite border-gray-300 text-charcoalBlack hover:bg-deepBlue hover:text-softWhite"}
            `}
          >
            <Icon size={22} />
            <span className="mt-1">{cat.category_name}</span>
          </button>
        );
      })}
    </div>
  );
}
