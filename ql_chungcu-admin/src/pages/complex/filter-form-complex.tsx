import {z} from "zod";

import {Card} from "@/components/ui/card.tsx";
import {
    Check,
    ChevronDown,
    ChevronDownIcon,
    Clock,
    X,
    Calendar as Cld,
} from "lucide-react";
import {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Label} from "@/components/ui/label.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {cn} from "@/lib/utils.ts";
import {Calendar} from "@/components/ui/calendar.tsx";

const schema = z.object({
    keyword: z.string().optional(),
    time_request_start: z.date().optional(),
    time_request_end: z.date().optional(),
    order: z.string().optional(),
});

export type FilterCplFormSchema = z.infer<typeof schema>;

type ComponentProps = {
    onSubmit: (status: string, filterTask: FilterCplFormSchema) => void;
    loading?: boolean;
    type: string;
};

export default function FilterCplForm({
                                          onSubmit,
                                          type
                                      }: ComponentProps) {
    const {
        watch,
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: {errors},
    } = useForm<FilterCplFormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            keyword: "",
            time_request_start: undefined,
            time_request_end: undefined,
            order: "",
        },
    });

    const time_request_start = watch("time_request_start");
    const time_request_end = watch("time_request_end");
    const order = watch("order");
    const keyword = watch("keyword");


    const [openTimeReqStart, setOpenTimeReqStart] = useState(false);
    const [openTimeReqEnd, setOpenTimeReqEnd] = useState(false);
    const [openDateReqPopover, setOpenDateReqPopover] = useState(false);

    return (
        <Card className="mb-6 p-6 border-slate-200 bg-white shadow-sm">
            <form
                onSubmit={handleSubmit((data) => {
                    // Gửi ngược data + id lên cha
                    if (type == "req") {
                        onSubmit("0", data);
                    } else {
                        onSubmit("1", data);
                    }
                })}
            >

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-3">

                    {/*date request*/}
                    <Popover
                        open={openDateReqPopover}
                        onOpenChange={setOpenDateReqPopover}
                    >
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <Cld className="mr-1 h-4 w-4"/>
                                Ngày gửi
                                <ChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                        >
                            <div className="flex w-64 flex-col gap-6 p-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-1 flex-col gap-3">
                                        <Label htmlFor="time_request_start" className="px-1">
                                            Từ ngày
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="time_request_start"
                                            render={({field}) => (
                                                <Popover
                                                    open={openTimeReqStart}
                                                    onOpenChange={setOpenTimeReqStart}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="time_request_start"
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {field.value
                                                                ? field.value.toLocaleDateString("en-CA")
                                                                : "Select date"}
                                                            <ChevronDownIcon/>
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent
                                                        className="w-auto overflow-hidden p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            captionLayout="dropdown"
                                                            disabled={
                                                                getValues("time_request_end")
                                                                    ? {
                                                                        after: new Date(
                                                                            getValues("time_request_end") ?? Date()
                                                                        ),
                                                                    }
                                                                    : false
                                                            }
                                                            onSelect={(date) => {
                                                                field.onChange(date);
                                                                setOpenTimeReqStart(false);
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-1 flex-col gap-3">
                                        <Label htmlFor="time-request-end" className="px-1">
                                            Đến ngày
                                        </Label>
                                        <Controller
                                            control={control}
                                            name="time_request_end"
                                            render={({field}) => (
                                                <Popover
                                                    open={openTimeReqEnd}
                                                    onOpenChange={setOpenTimeReqEnd}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="time-request-end"
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {field.value
                                                                ? field.value.toLocaleDateString("en-CA")
                                                                : "Select date"}
                                                            <ChevronDownIcon/>
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto overflow-hidden p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            captionLayout="dropdown"
                                                            disabled={
                                                                getValues("time_request_start")
                                                                    ? {
                                                                        before: new Date(
                                                                            getValues("time_request_start") ??
                                                                            Date()
                                                                        ),
                                                                    }
                                                                    : false
                                                            }
                                                            onSelect={(date) => {
                                                                field.onChange(date);
                                                                setOpenTimeReqEnd(false);
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>
                                </div>
                                {(time_request_start || time_request_end) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setValue("time_request_start", undefined);
                                            setValue("time_request_end", undefined);
                                            // Đóng popover cha để force re-render
                                            setOpenDateReqPopover(false);
                                        }}
                                        className="w-full text-slate-600 hover:text-slate-900"
                                    >
                                        <X className="mr-2 h-4 w-4"/>
                                        Xóa bộ lọc ngày gửi
                                    </Button>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Sort */}
                    <Controller
                        control={control}
                        name="order"
                        render={({field}) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-slate-200 bg-white hover:bg-slate-50"
                                    >
                                        <Clock className="mr-2 h-4 w-4"/>
                                        Sắp xếp
                                        {field.value && " (*)"}
                                        <ChevronDown className="ml-2 h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start" className="w-48">
                                    {["desc", "asc", ""].map((value) => (
                                        <DropdownMenuItem
                                            key={value}
                                            onSelect={() => field.onChange(value)}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    field.value === value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {value === "desc"
                                                ? "Mới nhất"
                                                : value === "asc"
                                                    ? "Cũ nhất"
                                                    : "Mặc định"}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    />

                    {/* Reset Filters */}
                    {(
                        time_request_start ||
                        order) && (
                        <Button
                            variant="ghost"
                            type="button"
                            size="sm"
                            onClick={() => {
                                setValue("time_request_start", undefined);
                                setValue("time_request_end", undefined);
                                setValue("order", "");
                            }}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                    <Button type="submit">Áp dụng</Button>
                </div>
            </form>
        </Card>
    );
}
