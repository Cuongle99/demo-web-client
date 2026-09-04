import {
  Baby,
  Bathtub,
  Bed,
  FirstAidKit,
  ForkKnife,
  Package,
  PersonSimpleRun,
} from "@phosphor-icons/react/dist/ssr";

export function CollectionIcon({ handle, title }: { handle: string; title: string }) {
  const value = `${handle} ${title}`.toLocaleLowerCase("vi");

  if (/chăn|ga|gối|nệm|nội thất/.test(value)) return <Bed weight="duotone" />;
  if (/em bé|trẻ em|tã|bô/.test(value)) return <Baby weight="duotone" />;
  if (/phòng tắm|chăm sóc cơ thể/.test(value)) return <Bathtub weight="duotone" />;
  if (/thể thao|dã ngoại|massage|trị liệu/.test(value)) return <PersonSimpleRun weight="duotone" />;
  if (/phòng ăn|nhà bếp/.test(value)) return <ForkKnife weight="duotone" />;
  if (/y tế|sức khỏe|chăm sóc|vật tư/.test(value)) return <FirstAidKit weight="duotone" />;

  return <Package weight="duotone" />;
}
