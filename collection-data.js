(function () {
    "use strict";

    function item(
        category,
        id,
        name,
        price,
        parent,
        note,
        purchaseId,
        requires,
        priceType
    ) {
        var resolvedType =
            priceType ||
            (price === 0 ? "free" : "coins");

        return {
            category: category,
            id: id,
            name: name,
            price: price,
            priceType: resolvedType,
            parent: parent || "",
            note: note || "",
            purchaseId: purchaseId || id,
            requires: requires || [],
            countsTowardCompletion:
                resolvedType !== "unlock" &&
                resolvedType !== "unavailable"
        };
    }

    function train(
        id,
        name,
        price,
        note,
        purchaseId,
        requires
    ) {
        return item(
            "trains",
            id,
            name,
            price,
            "",
            note,
            purchaseId,
            requires
        );
    }

    function livery(
        id,
        name,
        price,
        parent,
        note,
        purchaseId,
        requires
    ) {
        return item(
            "liveries",
            id,
            name,
            price,
            parent,
            note,
            purchaseId,
            requires
        );
    }

    function special(
        id,
        name,
        price,
        note,
        purchaseId,
        requires,
        priceType
    ) {
        return item(
            "weekly",
            id,
            name,
            price,
            "Weekly / Event item",
            note,
            purchaseId,
            requires,
            priceType
        );
    }

    function route(
        id,
        name,
        price,
        note,
        purchaseId,
        requires
    ) {
        return item(
            "routes",
            id,
            name,
            price,
            "Route pack",
            note,
            purchaseId,
            requires
        );
    }

    window.BRDB_COLLECTION_DATA = {
        version: 1,

        trains: [
            train(
                "class-47",
                "Class 47",
                2500,
                "Diesel locomotive.",
                "train-class-47",
                []
            ),

            train(
                "class-86",
                "Class 86",
                3000,
                "Electric locomotive.",
                "train-class-86",
                []
            ),

            train(
                "class-90",
                "Class 90",
                2000,
                "Electric locomotive.",
                "train-class-90",
                []
            ),

            train(
                "class-142",
                "Class 142",
                500,
                "May be selected free as a starter train.",
                "train-class-142",
                []
            ),

            train(
                "class-150",
                "Class 150",
                500,
                "May be selected free as a starter train.",
                "train-class-150",
                []
            ),

            train(
                "class-153",
                "Class 153",
                1500,
                "One-car Sprinter.",
                "train-class-153",
                []
            ),

            train(
                "class-156",
                "Class 156",
                800,
                "Two-car Sprinter.",
                "train-class-156",
                []
            ),

            train(
                "class-158",
                "Class 158",
                1500,
                "Required before the Class 159.",
                "train-class-158",
                []
            ),

            train(
                "class-159",
                "Class 159",
                300,
                "Requires the Class 158.",
                "train-class-159",
                ["train-class-158"]
            ),

            train(
                "class-170",
                "Class 170",
                1500,
                "Required before the Class 171.",
                "train-class-170",
                []
            ),

            train(
                "class-171",
                "Class 171",
                500,
                "Requires the Class 170.",
                "train-class-171",
                ["train-class-170"]
            ),

            train(
                "class-180",
                "Class 180",
                3500,
                "Five-car Adelante.",
                "train-class-180",
                []
            ),

            train(
                "class-220",
                "Class 220",
                2500,
                "Included in the Voyager Pack with Class 221.",
                "train-voyager-pack",
                []
            ),

            train(
                "class-221",
                "Class 221",
                2500,
                "Included in the Voyager Pack with Class 220.",
                "train-voyager-pack",
                []
            ),

            train(
                "class-230",
                "Class 230",
                500,
                "May be selected free as a starter train.",
                "train-class-230",
                []
            ),

            train(
                "class-231",
                "Class 231",
                500,
                "Bundled with Class 756; requires Class 755.",
                "train-231-756-pack",
                ["train-class-755"]
            ),

            train(
                "class-321",
                "Class 321",
                2000,
                "Required before the Class 322.",
                "train-class-321",
                []
            ),

            train(
                "class-322",
                "Class 322",
                300,
                "Requires the Class 321.",
                "train-class-322",
                ["train-class-321"]
            ),

            train(
                "class-350",
                "Class 350",
                2500,
                "Four-car Desiro.",
                "train-class-350",
                []
            ),

            train(
                "class-745",
                "Class 745",
                1250,
                "Requires the Class 755.",
                "train-class-745",
                ["train-class-755"]
            ),

            train(
                "class-755",
                "Class 755",
                3000,
                "Required before Classes 231, 745 and 756.",
                "train-class-755",
                []
            ),

            train(
                "class-756",
                "Class 756",
                500,
                "Bundled with Class 231; requires Class 755.",
                "train-231-756-pack",
                ["train-class-755"]
            ),

            train(
                "class-800",
                "Class 800",
                4000,
                "Included in the 80X Pack.",
                "train-80x-pack",
                []
            ),

            train(
                "class-801",
                "Class 801",
                4000,
                "Included in the 80X Pack.",
                "train-80x-pack",
                []
            ),

            train(
                "class-802",
                "Class 802",
                4000,
                "Included in the 80X Pack.",
                "train-80x-pack",
                []
            ),

            train(
                "class-803",
                "Class 803",
                4000,
                "Included in the 80X Pack.",
                "train-80x-pack",
                []
            ),

            train(
                "class-805",
                "Class 805",
                4000,
                "Included in the 80X Pack.",
                "train-80x-pack",
                []
            ),

            train(
                "class-807",
                "Class 807",
                4000,
                "Included in the 80X Pack.",
                "train-80x-pack",
                []
            ),

            train(
                "mark-2-coaches",
                "Mark 2 coaches",
                1000,
                "Requires ownership of any locomotive.",
                "train-mark-2-coaches",
                []
            ),

            train(
                "mark-2-dbso",
                "Mark 2 DBSO",
                750,
                "Requires Mark 2 coaches and a compatible locomotive.",
                "train-mark-2-dbso",
                ["train-mark-2-coaches"]
            ),

            train(
                "mark-3-coaches",
                "Mark 3 coaches",
                0,
                "Free after purchasing any locomotive.",
                "train-mark-3-coaches",
                []
            ),

            train(
                "mark-3-dvt",
                "Mark 3 DVT",
                750,
                "Requires ownership of a compatible locomotive.",
                "train-mark-3-dvt",
                []
            )
        ],

        liveries: [
            livery(
                "47-br-blue",
                "BR Blue",
                0,
                "Class 47",
                "",
                "livery-47-br-blue",
                ["train-class-47"]
            ),

            livery(
                "47-green",
                "BR Two-tone Green",
                0,
                "Class 47",
                "",
                "livery-47-green",
                ["train-class-47"]
            ),

            livery(
                "47-grey",
                "GB Railfreight Distribution",
                200,
                "Class 47",
                "",
                "livery-47-grey",
                ["train-class-47"]
            ),

            livery(
                "47-scotrail",
                "Scotrail",
                200,
                "Class 47",
                "",
                "livery-47-scotrail",
                ["train-class-47"]
            ),

            livery(
                "47-intercity",
                "Intercity Swallow",
                200,
                "Class 47",
                "",
                "livery-47-intercity",
                ["train-class-47"]
            ),

            livery(
                "86-intercity-executive",
                "Intercity Executive",
                200,
                "Class 86",
                "",
                "livery-86-intercity-executive",
                ["train-class-86"]
            ),

            livery(
                "86-br-blue",
                "BR Blue",
                0,
                "Class 86",
                "",
                "livery-86-br-blue",
                ["train-class-86"]
            ),

            livery(
                "86-anglia",
                "Anglia Railways",
                200,
                "Class 86",
                "",
                "livery-86-anglia",
                ["train-class-86"]
            ),

            livery(
                "86-intercity-swallow",
                "Intercity Swallow",
                0,
                "Class 86",
                "",
                "livery-86-intercity-swallow",
                ["train-class-86"]
            ),

            livery(
                "86-virgin",
                "Virgin Trains",
                200,
                "Class 86",
                "",
                "livery-86-virgin",
                ["train-class-86"]
            ),

            livery(
                "86-ews",
                "EWS",
                200,
                "Class 86",
                "",
                "livery-86-ews",
                ["train-class-86"]
            ),

            livery(
                "90-anglia",
                "Greater Anglia",
                200,
                "Class 90",
                "",
                "livery-90-anglia",
                ["train-class-90"]
            ),

            livery(
                "90-ex-freightliner",
                "Ex-Freightliner",
                200,
                "Class 90",
                "",
                "livery-90-ex-freightliner",
                ["train-class-90"]
            ),

            livery(
                "90-one",
                "ONE Anglia",
                200,
                "Class 90",
                "",
                "livery-90-one",
                ["train-class-90"]
            ),

            livery(
                "90-intercity",
                "Intercity Swallow",
                0,
                "Class 90",
                "",
                "livery-90-intercity",
                ["train-class-90"]
            ),

            livery(
                "90-virgin",
                "Virgin Trains",
                200,
                "Class 90",
                "",
                "livery-90-virgin",
                ["train-class-90"]
            ),

            livery(
                "142-atn",
                "Arriva Trains Northern",
                200,
                "Class 142",
                "One purchase unlocks all three Arriva/TfW variants.",
                "livery-142-arriva-pack",
                ["train-class-142"]
            ),

            livery(
                "142-atw",
                "Arriva Trains Wales",
                200,
                "Class 142",
                "One purchase unlocks all three Arriva/TfW variants.",
                "livery-142-arriva-pack",
                ["train-class-142"]
            ),

            livery(
                "142-tfw-ex-arriva",
                "Transport for Wales (Ex-Arriva)",
                200,
                "Class 142",
                "One purchase unlocks all three Arriva/TfW variants.",
                "livery-142-arriva-pack",
                ["train-class-142"]
            ),

            livery(
                "142-br",
                "British Railways",
                0,
                "Class 142",
                "",
                "livery-142-br",
                ["train-class-142"]
            ),

            livery(
                "142-br-bifold",
                "British Railways (Bifold)",
                0,
                "Class 142",
                "",
                "livery-142-br-bifold",
                ["train-class-142"]
            ),

            livery(
                "142-fgw",
                "First Great Western",
                200,
                "Class 142",
                "One purchase unlocks all three variants.",
                "livery-142-fgw-pack",
                ["train-class-142"]
            ),

            livery(
                "142-fgw-blue",
                "First Great Western (Blue)",
                200,
                "Class 142",
                "One purchase unlocks all three variants.",
                "livery-142-fgw-pack",
                ["train-class-142"]
            ),

            livery(
                "142-fnw",
                "First North Western",
                200,
                "Class 142",
                "One purchase unlocks all three variants.",
                "livery-142-fgw-pack",
                ["train-class-142"]
            ),

            livery(
                "142-gmpte-orange",
                "GMPTE (Orange)",
                200,
                "Class 142",
                "One purchase unlocks both orange variants.",
                "livery-142-gmpte-orange-pack",
                ["train-class-142"]
            ),

            livery(
                "142-gmpte-bifold",
                "GMPTE (Bifold)",
                200,
                "Class 142",
                "One purchase unlocks both orange variants.",
                "livery-142-gmpte-orange-pack",
                ["train-class-142"]
            ),

            livery(
                "142-gmpte-black",
                "GMPTE (Black)",
                200,
                "Class 142",
                "",
                "livery-142-gmpte-black",
                ["train-class-142"]
            ),

            livery(
                "142-mersey",
                "Merseyrail",
                200,
                "Class 142",
                "One purchase unlocks both Merseyrail variants.",
                "livery-142-mersey-pack",
                ["train-class-142"]
            ),

            livery(
                "142-mersey-refurb",
                "Merseyrail (Refurbished)",
                200,
                "Class 142",
                "One purchase unlocks both Merseyrail variants.",
                "livery-142-mersey-pack",
                ["train-class-142"]
            ),

            livery(
                "142-northern",
                "Northern Rail",
                200,
                "Class 142",
                "One purchase unlocks both Northern variants.",
                "livery-142-northern-pack",
                ["train-class-142"]
            ),

            livery(
                "142-northern-ex-mersey",
                "Northern Rail (Ex-Merseyrail)",
                200,
                "Class 142",
                "One purchase unlocks both Northern variants.",
                "livery-142-northern-pack",
                ["train-class-142"]
            ),

            livery(
                "142-regional",
                "Regional Railways",
                200,
                "Class 142",
                "",
                "livery-142-regional",
                ["train-class-142"]
            ),

            livery(
                "142-twpte",
                "Tyne and Wear PTE",
                200,
                "Class 142",
                "",
                "livery-142-twpte",
                ["train-class-142"]
            ),

            livery(
                "142-valley",
                "Valley Lines",
                200,
                "Class 142",
                "",
                "livery-142-valley",
                ["train-class-142"]
            ),

            livery(
                "150-atw-executive",
                "Arriva Trains Wales Executive",
                200,
                "Class 150",
                "",
                "livery-150-atw-executive",
                ["train-class-150"]
            ),

            livery(
                "150-atw",
                "Arriva Trains Wales",
                200,
                "Class 150",
                "",
                "livery-150-atw",
                ["train-class-150"]
            ),

            livery(
                "150-central-old",
                "Central Trains (old)",
                300,
                "Class 150",
                "One purchase unlocks both Central Trains variants.",
                "livery-150-central-pack",
                ["train-class-150"]
            ),

            livery(
                "150-central-new",
                "Central Trains (new)",
                300,
                "Class 150",
                "One purchase unlocks both Central Trains variants.",
                "livery-150-central-pack",
                ["train-class-150"]
            ),

            livery(
                "150-overground",
                "London Overground (Ex-Silverlink)",
                300,
                "Class 150",
                "One purchase unlocks both Silverlink variants.",
                "livery-150-silverlink-pack",
                ["train-class-150"]
            ),

            livery(
                "150-silverlink",
                "Silverlink",
                300,
                "Class 150",
                "One purchase unlocks both Silverlink variants.",
                "livery-150-silverlink-pack",
                ["train-class-150"]
            ),

            livery(
                "150-gwr",
                "Great Western Railway",
                200,
                "Class 150",
                "",
                "livery-150-gwr",
                ["train-class-150"]
            ),

            livery(
                "150-fgw-1",
                "First Great Western (150/1)",
                300,
                "Class 150",
                "",
                "livery-150-fgw-1",
                ["train-class-150"]
            ),

            livery(
                "150-fgw-2",
                "First Great Western (150/2)",
                200,
                "Class 150",
                "",
                "livery-150-fgw-2",
                ["train-class-150"]
            ),

            livery(
                "150-northern-1",
                "Northern Rail (150/1)",
                300,
                "Class 150",
                "Includes both 150/1 headlight variations.",
                "livery-150-northern-1",
                ["train-class-150"]
            ),

            livery(
                "150-northern-2",
                "Northern Rail (150/2)",
                0,
                "Class 150",
                "Includes the 2+3 seating variant.",
                "livery-150-northern-2",
                ["train-class-150"]
            ),

            livery(
                "150-northern-modern-1",
                "Northern Trains (150/1)",
                300,
                "Class 150",
                "",
                "livery-150-northern-modern-1",
                ["train-class-150"]
            ),

            livery(
                "150-northern-modern-2",
                "Northern Trains (150/2)",
                200,
                "Class 150",
                "Includes the 2+3 seating variant.",
                "livery-150-northern-modern-2",
                ["train-class-150"]
            ),

            livery(
                "150-scotrail-nx",
                "ScotRail (National Express)",
                200,
                "Class 150",
                "",
                "livery-150-scotrail-nx",
                ["train-class-150"]
            ),

            livery(
                "150-regional",
                "Regional Railways",
                300,
                "Class 150",
                "",
                "livery-150-regional",
                ["train-class-150"]
            ),

            livery(
                "150-gmpte",
                "GMPTE / Regional Black",
                200,
                "Class 150",
                "",
                "livery-150-gmpte",
                ["train-class-150"]
            ),

            livery(
                "150-tfw",
                "Transport for Wales",
                200,
                "Class 150",
                "",
                "livery-150-tfw",
                ["train-class-150"]
            ),

            livery(
                "153-atn",
                "Arriva Trains Northern",
                200,
                "Class 153",
                "",
                "livery-153-atn",
                ["train-class-153"]
            ),

            livery(
                "153-atw",
                "Arriva Trains Wales",
                200,
                "Class 153",
                "",
                "livery-153-atw",
                ["train-class-153"]
            ),

            livery(
                "153-central",
                "Central Trains",
                200,
                "Class 153",
                "",
                "livery-153-central",
                ["train-class-153"]
            ),

            livery(
                "153-lm",
                "London Midland",
                200,
                "Class 153",
                "",
                "livery-153-lm",
                ["train-class-153"]
            ),

            livery(
                "153-regional",
                "Regional Railways",
                0,
                "Class 153",
                "",
                "livery-153-regional",
                ["train-class-153"]
            ),

            livery(
                "153-tfw",
                "Transport for Wales",
                200,
                "Class 153",
                "",
                "livery-153-tfw",
                ["train-class-153"]
            ),

            livery(
                "156-br",
                "British Railways",
                0,
                "Class 156",
                "",
                "livery-156-br",
                ["train-class-156"]
            ),

            livery(
                "156-emt",
                "East Midlands Trains",
                200,
                "Class 156",
                "",
                "livery-156-emt",
                ["train-class-156"]
            ),

            livery(
                "156-one",
                "ONE Anglia",
                200,
                "Class 156",
                "",
                "livery-156-one",
                ["train-class-156"]
            ),

            livery(
                "156-emr",
                "East Midlands Railway",
                200,
                "Class 156",
                "",
                "livery-156-emr",
                ["train-class-156"]
            ),

            livery(
                "156-northern",
                "Northern Rail",
                200,
                "Class 156",
                "",
                "livery-156-northern",
                ["train-class-156"]
            ),

            livery(
                "156-regional",
                "Regional Railways",
                200,
                "Class 156",
                "",
                "livery-156-regional",
                ["train-class-156"]
            ),

            livery(
                "156-scotrail",
                "ScotRail",
                200,
                "Class 156",
                "",
                "livery-156-scotrail",
                ["train-class-156"]
            ),

            livery(
                "156-strathclyde",
                "Strathclyde Transport",
                200,
                "Class 156",
                "",
                "livery-156-strathclyde",
                ["train-class-156"]
            ),

            livery(
                "158-northern",
                "Northern Rail",
                200,
                "Class 158",
                "",
                "livery-158-northern",
                ["train-class-158"]
            ),

            livery(
                "158-northern-modern",
                "Northern Trains",
                200,
                "Class 158",
                "",
                "livery-158-northern-modern",
                ["train-class-158"]
            ),

            livery(
                "158-gwr",
                "Great Western Railway",
                0,
                "Class 158",
                "",
                "livery-158-gwr",
                ["train-class-158"]
            ),

            livery(
                "158-emr",
                "East Midlands Railway",
                200,
                "Class 158",
                "One purchase unlocks both EMR variants.",
                "livery-158-emr-pack",
                ["train-class-158"]
            ),

            livery(
                "158-emr-regional",
                "East Midlands Railway (Regional)",
                200,
                "Class 158",
                "One purchase unlocks both EMR variants.",
                "livery-158-emr-pack",
                ["train-class-158"]
            ),

            livery(
                "158-swt",
                "South West Trains",
                200,
                "Class 158",
                "",
                "livery-158-swt",
                ["train-class-158"]
            ),

            livery(
                "159-swt",
                "South West Trains",
                0,
                "Class 159",
                "",
                "livery-159-swt",
                ["train-class-159"]
            ),

            livery(
                "170-crosscountry",
                "CrossCountry",
                300,
                "Class 170",
                "",
                "livery-170-crosscountry",
                ["train-class-170"]
            ),

            livery(
                "170-one",
                "ONE Anglia",
                200,
                "Class 170",
                "",
                "livery-170-one",
                ["train-class-170"]
            ),

            livery(
                "170-tfw",
                "Transport for Wales",
                300,
                "Class 170",
                "",
                "livery-170-tfw",
                ["train-class-170"]
            ),

            livery(
                "170-ftpe",
                "First TransPennine Express",
                200,
                "Class 170",
                "",
                "livery-170-ftpe",
                ["train-class-170"]
            ),

            livery(
                "170-swt",
                "South West Trains",
                200,
                "Class 170",
                "",
                "livery-170-swt",
                ["train-class-170"]
            ),

            livery(
                "170-emr-ex-southern",
                "East Midlands Railway (Ex-Southern)",
                100,
                "Class 170",
                "",
                "livery-170-emr-ex-southern",
                ["train-class-170"]
            ),

            livery(
                "170-emr",
                "East Midlands Railway",
                300,
                "Class 170",
                "",
                "livery-170-emr",
                ["train-class-170"]
            ),

            livery(
                "170-scotrail-nx",
                "ScotRail (National Express)",
                0,
                "Class 170",
                "",
                "livery-170-scotrail-nx",
                ["train-class-170"]
            ),

            livery(
                "170-northern",
                "Northern Trains",
                200,
                "Class 170",
                "",
                "livery-170-northern",
                ["train-class-170"]
            ),

            livery(
                "170-scotrail",
                "ScotRail",
                200,
                "Class 170",
                "",
                "livery-170-scotrail",
                ["train-class-170"]
            ),

            livery(
                "170-lm",
                "London Midland",
                300,
                "Class 170",
                "",
                "livery-170-lm",
                ["train-class-170"]
            ),

            livery(
                "171-southern",
                "Southern",
                0,
                "Class 171",
                "",
                "livery-171-southern",
                ["train-class-171"]
            ),

            livery(
                "180-fgw",
                "First Great Western",
                0,
                "Class 180",
                "",
                "livery-180-fgw",
                ["train-class-180"]
            ),

            livery(
                "180-grand-central",
                "Grand Central",
                200,
                "Class 180",
                "",
                "livery-180-grand-central",
                ["train-class-180"]
            ),

            livery(
                "180-hull",
                "Hull Trains",
                200,
                "Class 180",
                "",
                "livery-180-hull",
                ["train-class-180"]
            ),

            livery(
                "180-emr",
                "East Midlands Railway",
                200,
                "Class 180",
                "",
                "livery-180-emr",
                ["train-class-180"]
            ),

            livery(
                "180-northern",
                "Northern Rail",
                300,
                "Class 180",
                "",
                "livery-180-northern",
                ["train-class-180"]
            ),

            livery(
                "220-crosscountry",
                "CrossCountry",
                0,
                "Class 220",
                "",
                "livery-220-crosscountry",
                ["train-voyager-pack"]
            ),

            livery(
                "220-virgin",
                "Virgin Trains",
                200,
                "Class 220",
                "",
                "livery-220-virgin",
                ["train-voyager-pack"]
            ),

            livery(
                "221-crosscountry",
                "CrossCountry",
                0,
                "Class 221",
                "",
                "livery-221-crosscountry",
                ["train-voyager-pack"]
            ),

            livery(
                "221-virgin",
                "Virgin Trains",
                200,
                "Class 221",
                "",
                "livery-221-virgin",
                ["train-voyager-pack"]
            ),

            livery(
                "221-avanti",
                "Avanti West Coast",
                200,
                "Class 221",
                "",
                "livery-221-avanti",
                ["train-voyager-pack"]
            ),

            livery(
                "221-avanti-white",
                "Avanti West Coast (White)",
                0,
                "Class 221",
                "",
                "livery-221-avanti-white",
                ["train-voyager-pack"]
            ),

            livery(
                "230-gwr",
                "Great Western Railway",
                300,
                "Class 230",
                "",
                "livery-230-gwr",
                ["train-class-230"]
            ),

            livery(
                "230-lnwr",
                "London Northwestern Railway",
                0,
                "Class 230",
                "",
                "livery-230-lnwr",
                ["train-class-230"]
            ),

            livery(
                "230-tfw",
                "Transport for Wales",
                300,
                "Class 230",
                "",
                "livery-230-tfw",
                ["train-class-230"]
            ),

            livery(
                "231-tfw",
                "Transport for Wales",
                0,
                "Class 231",
                "",
                "livery-231-tfw",
                ["train-231-756-pack"]
            ),

            livery(
                "321-anglia-blue",
                "Greater Anglia (Blue)",
                0,
                "Class 321",
                "",
                "livery-321-anglia-blue",
                ["train-class-321"]
            ),

            livery(
                "321-anglia-red",
                "Greater Anglia (Red)",
                0,
                "Class 321",
                "",
                "livery-321-anglia-red",
                ["train-class-321"]
            ),

            livery(
                "321-gn-ex-fcc",
                "Great Northern (Ex-FCC)",
                300,
                "Class 321",
                "",
                "livery-321-gn-ex-fcc",
                ["train-class-321"]
            ),

            livery(
                "321-anglia-ex-nxea",
                "Greater Anglia (Ex-National Express)",
                200,
                "Class 321",
                "",
                "livery-321-anglia-ex-nxea",
                ["train-class-321"]
            ),

            livery(
                "321-fcc",
                "First Capital Connect",
                300,
                "Class 321",
                "",
                "livery-321-fcc",
                ["train-class-321"]
            ),

            livery(
                "321-silverlink",
                "Silverlink",
                200,
                "Class 321",
                "",
                "livery-321-silverlink",
                ["train-class-321"]
            ),

            livery(
                "322-northern",
                "Northern Metro",
                0,
                "Class 322",
                "",
                "livery-322-northern",
                ["train-class-322"]
            ),

            livery(
                "350-central-silverlink",
                "Central Trains / Silverlink",
                0,
                "Class 350",
                "",
                "livery-350-central-silverlink",
                ["train-class-350"]
            ),

            livery(
                "350-lm",
                "London Midland",
                200,
                "Class 350",
                "",
                "livery-350-lm",
                ["train-class-350"]
            ),

            livery(
                "350-tpe",
                "TransPennine Express",
                200,
                "Class 350",
                "",
                "livery-350-tpe",
                ["train-class-350"]
            ),

            livery(
                "350-lnwr",
                "London Northwestern Railway",
                200,
                "Class 350",
                "",
                "livery-350-lnwr",
                ["train-class-350"]
            ),

            livery(
                "745-intercity",
                "Greater Anglia (Intercity)",
                0,
                "Class 745",
                "",
                "livery-745-intercity",
                ["train-class-745"]
            ),

            livery(
                "745-airport",
                "Greater Anglia (Stansted Express)",
                0,
                "Class 745",
                "",
                "livery-745-airport",
                ["train-class-745"]
            ),

            livery(
                "755-anglia",
                "Greater Anglia",
                0,
                "Class 755",
                "",
                "livery-755-anglia",
                ["train-class-755"]
            ),

            livery(
                "756-tfw",
                "Transport for Wales",
                0,
                "Class 756",
                "",
                "livery-756-tfw",
                ["train-231-756-pack"]
            ),

            livery(
                "800-gwr",
                "Great Western Railway",
                400,
                "Class 800",
                "One purchase also unlocks the Class 802 GWR livery.",
                "livery-80x-gwr-pack",
                ["train-80x-pack"]
            ),

            livery(
                "800-lner",
                "London North Eastern Railway",
                0,
                "Class 800",
                "",
                "livery-800-lner",
                ["train-80x-pack"]
            ),

            livery(
                "801-lner",
                "London North Eastern Railway",
                0,
                "Class 801",
                "",
                "livery-801-lner",
                ["train-80x-pack"]
            ),

            livery(
                "802-gwr",
                "Great Western Railway",
                400,
                "Class 802",
                "One purchase also unlocks the Class 800 GWR livery.",
                "livery-80x-gwr-pack",
                ["train-80x-pack"]
            ),

            livery(
                "802-tpe",
                "TransPennine Express",
                200,
                "Class 802",
                "",
                "livery-802-tpe",
                ["train-80x-pack"]
            ),

            livery(
                "802-hull",
                "Hull Trains",
                200,
                "Class 802",
                "",
                "livery-802-hull",
                ["train-80x-pack"]
            ),

            livery(
                "803-lumo",
                "Lumo",
                200,
                "Class 803",
                "",
                "livery-803-lumo",
                ["train-80x-pack"]
            ),

            livery(
                "805-avanti",
                "Avanti West Coast",
                400,
                "Class 805",
                "One purchase also unlocks the Class 807 livery.",
                "livery-805-807-avanti-pack",
                ["train-80x-pack"]
            ),

            livery(
                "807-avanti",
                "Avanti West Coast",
                400,
                "Class 807",
                "One purchase also unlocks the Class 805 livery.",
                "livery-805-807-avanti-pack",
                ["train-80x-pack"]
            ),

            livery(
                "mk2-anglia",
                "Anglia Railways",
                200,
                "Mark 2 coaches",
                "",
                "livery-mk2-anglia",
                ["train-mark-2-coaches"]
            ),

            livery(
                "mk2-blue",
                "BR Blue",
                0,
                "Mark 2 coaches",
                "",
                "livery-mk2-blue",
                ["train-mark-2-coaches"]
            ),

            livery(
                "mk2-intercity",
                "Intercity Swallow",
                200,
                "Mark 2 coaches",
                "",
                "livery-mk2-intercity",
                ["train-mark-2-coaches"]
            ),

            livery(
                "mk2-scotrail",
                "Scotrail",
                200,
                "Mark 2 coaches",
                "",
                "livery-mk2-scotrail",
                ["train-mark-2-coaches"]
            ),

            livery(
                "mk2-dbso-anglia",
                "Anglia Railways",
                150,
                "Mark 2 DBSO",
                "",
                "livery-mk2-dbso-anglia",
                ["train-mark-2-dbso"]
            ),

            livery(
                "mk2-dbso-blue",
                "BR Blue",
                0,
                "Mark 2 DBSO",
                "",
                "livery-mk2-dbso-blue",
                ["train-mark-2-dbso"]
            ),

            livery(
                "mk2-dbso-intercity",
                "Intercity Swallow",
                150,
                "Mark 2 DBSO",
                "",
                "livery-mk2-dbso-intercity",
                ["train-mark-2-dbso"]
            ),

            livery(
                "mk2-dbso-scotrail",
                "Scotrail",
                150,
                "Mark 2 DBSO",
                "",
                "livery-mk2-dbso-scotrail",
                ["train-mark-2-dbso"]
            ),

            livery(
                "mk3-blue",
                "BR Blue",
                0,
                "Mark 3 coaches",
                "",
                "livery-mk3-blue",
                ["train-mark-3-coaches"]
            ),

            livery(
                "mk3-intercity",
                "Intercity Swallow",
                0,
                "Mark 3 coaches",
                "",
                "livery-mk3-intercity",
                ["train-mark-3-coaches"]
            ),

            livery(
                "mk3-virgin",
                "Virgin Trains",
                200,
                "Mark 3 coaches",
                "",
                "livery-mk3-virgin",
                ["train-mark-3-coaches"]
            ),

            livery(
                "mk3-anglia",
                "Greater Anglia",
                200,
                "Mark 3 coaches",
                "",
                "livery-mk3-anglia",
                ["train-mark-3-coaches"]
            ),

            livery(
                "mk3-one",
                "ONE Anglia",
                200,
                "Mark 3 coaches",
                "",
                "livery-mk3-one",
                ["train-mark-3-coaches"]
            ),

            livery(
                "mk3-dvt-anglia",
                "Greater Anglia",
                200,
                "Mark 3 DVT",
                "",
                "livery-mk3-dvt-anglia",
                ["train-mark-3-dvt"]
            ),

            livery(
                "mk3-dvt-one",
                "ONE Anglia",
                200,
                "Mark 3 DVT",
                "",
                "livery-mk3-dvt-one",
                ["train-mark-3-dvt"]
            ),

            livery(
                "mk3-dvt-intercity",
                "Intercity Swallow",
                0,
                "Mark 3 DVT",
                "",
                "livery-mk3-dvt-intercity",
                ["train-mark-3-dvt"]
            ),

            livery(
                "mk3-dvt-virgin",
                "Virgin Trains",
                200,
                "Mark 3 DVT",
                "",
                "livery-mk3-dvt-virgin",
                ["train-mark-3-dvt"]
            )
        ],

        weekly: [
            special(
                "weekly-br-blue-heritage",
                "BR Blue Heritage Set",
                1250,
                "Class 86 101 + Mark 3 DVT 82115.",
                "weekly-br-blue-heritage",
                [
                    "train-class-86",
                    "train-mark-3-dvt"
                ],
                "coins"
            ),

            special(
                "weekly-pretendolino",
                "Pretendolino Set",
                2000,
                "Mark 3 coaches + Mark 3 DVT 82126.",
                "weekly-pretendolino",
                [
                    "train-mark-3-coaches",
                    "train-mark-3-dvt"
                ],
                "coins"
            ),

            special(
                "weekly-dutch-321",
                "NS/NSE Dutch Class 321 334",
                1000,
                "Unique Class 321 livery.",
                "weekly-dutch-321",
                ["train-class-321"],
                "coins"
            ),

            special(
                "weekly-silk-221",
                "Virgin Trains Silk Class 221 101",
                1000,
                "Unique Class 221 livery.",
                "weekly-silk-221",
                ["train-voyager-pack"],
                "coins"
            ),

            special(
                "weekly-silk-800",
                "Virgin Trains Silk Class 800 101",
                2000,
                "Unique Class 800 livery.",
                "weekly-silk-800",
                ["train-80x-pack"],
                "coins"
            ),

            special(
                "weekly-electric-blue-86",
                "Electric Blue Class 86 259",
                1500,
                "Heritage Class 86 livery.",
                "weekly-electric-blue-86",
                ["train-class-86"],
                "coins"
            ),

            special(
                "weekly-short-221",
                "Virgin Trains Class 221 144 (2 car)",
                10000,
                "Unique two-car Voyager consist.",
                "weekly-short-221",
                ["train-voyager-pack"],
                "coins"
            ),

            special(
                "weekly-swt-cracker",
                "SWT Cracker Class 159 103",
                1000,
                "Unique Class 159 livery.",
                "weekly-swt-cracker",
                ["train-class-159"],
                "coins"
            ),

            special(
                "weekly-northern-156",
                "Northern Prototype Class 156 set",
                1250,
                "Includes Class 156 units 425 and 451.",
                "weekly-northern-156",
                ["train-class-156"],
                "coins"
            ),

            special(
                "weekly-overground-321",
                "London Overground Class 321 414",
                750,
                "Unique Class 321 livery.",
                "weekly-overground-321",
                ["train-class-321"],
                "coins"
            ),

            special(
                "weekly-one-dbso",
                "ONE Anglia Mark 2 DBSO 9710",
                1000,
                "Unique Mark 2 DBSO livery.",
                "weekly-one-dbso",
                ["train-mark-2-dbso"],
                "coins"
            ),

            special(
                "weekly-ht-802",
                "Hull Trains Anniversary Class 802 305",
                1000,
                "Unique Class 802 livery.",
                "weekly-ht-802",
                ["train-80x-pack"],
                "coins"
            ),

            special(
                "weekly-white-80x",
                "Blank White 80X Set",
                1250,
                "Unlocks white liveries for Classes 800 and 802.",
                "weekly-white-80x",
                ["train-80x-pack"],
                "coins"
            ),

            special(
                "weekly-anglia-86",
                "Anglia Railways UK Class 86 227",
                750,
                "Golden Jubilee heritage livery.",
                "weekly-anglia-86",
                ["train-class-86"],
                "coins"
            ),

            special(
                "weekly-police-47",
                "British Transport Police Class 47 829",
                10000,
                "Unique Police Class 47 livery.",
                "weekly-police-47",
                ["train-class-47"],
                "coins"
            ),

            special(
                "weekly-cop26-230",
                "Vivarail COP26 Class 230 001",
                1000,
                "Viva Venturer special livery.",
                "weekly-cop26-230",
                ["train-class-230"],
                "coins"
            ),

            special(
                "weekly-dual-fuel-180",
                "Grand Central Dual Fuel Class 180 112",
                750,
                "James Herriot special livery.",
                "weekly-dual-fuel-180",
                ["train-class-180"],
                "coins"
            ),

            special(
                "weekly-tfw-test-230",
                "Transport for Wales Test Train Class 230",
                500,
                "Wales testing livery.",
                "weekly-tfw-test-230",
                ["train-class-230"],
                "coins"
            ),

            special(
                "weekly-northern-150",
                "Northern Prototype Class 150",
                750,
                "Northern Prototype special livery.",
                "weekly-northern-150",
                ["train-class-150"],
                "coins"
            ),

            special(
                "weekly-pride-set",
                "Pride Set",
                5000,
                "Includes Classes 220 005, 350 375 and 800 008.",
                "weekly-pride-set",
                [
                    "train-voyager-pack",
                    "train-class-350",
                    "train-80x-pack"
                ],
                "coins"
            ),

            special(
                "weekly-lnwr-150",
                "LNWR Marston Vale Class 150/1",
                1500,
                "Fayre Line special livery.",
                "weekly-lnwr-150",
                ["train-class-150"],
                "coins"
            ),

            special(
                "event-skipper-142",
                "BR Skipper Class 142",
                null,
                "Former The Hatch event reward; currently unobtainable.",
                "event-skipper-142",
                ["train-class-142"],
                "unlock"
            )
        ],

        routes: [
            route(
                "default-free-route",
                "Default Free Route",
                0,
                "Leaton to Victoria Docks, Longbow or Belmond Green.",
                "route-default",
                []
            ),

            route(
                "ashdean-branch",
                "Ashdean Branch",
                400,
                "Longbow to Ashdean and Broomfield.",
                "route-ashdean",
                []
            ),

            route(
                "fayre-branchline",
                "Fayre Branchline",
                500,
                "Requires Mill Bridge Mainline.",
                "route-fayre",
                ["route-mill-bridge"]
            ),

            route(
                "fleetwood-avonhill",
                "Fleetwood and Avonhill",
                600,
                "Belmond Green to Avonhill.",
                "route-fleetwood-avonhill",
                []
            ),

            route(
                "mill-bridge-mainline",
                "Mill Bridge Mainline",
                600,
                "Leaton to Mill Bridge.",
                "route-mill-bridge",
                []
            ),

            route(
                "brynmouth-extension",
                "MBML: Brynmouth Extension",
                400,
                "Requires Mill Bridge Mainline.",
                "route-brynmouth",
                ["route-mill-bridge"]
            ),

            route(
                "newhurst-branch",
                "Newhurst Branch",
                200,
                "Victoria Docks to Syde-On-Sea.",
                "route-newhurst",
                []
            ),

            route(
                "norrington-mainline",
                "Norrington Mainline",
                600,
                "Leaton to Norrington.",
                "route-norrington",
                []
            ),

            route(
                "cuffley-extension",
                "NML: Cuffley Extension",
                450,
                "Requires Norrington Mainline.",
                "route-cuffley",
                ["route-norrington"]
            ),

            route(
                "stonebrook-branch",
                "Stonebrook Branch",
                450,
                "Requires Norrington Mainline.",
                "route-stonebrook",
                ["route-norrington"]
            ),

            route(
                "victoria-harbour",
                "Victoria Harbour",
                50,
                "Unlocks Victoria Harbour routes.",
                "route-victoria-harbour",
                []
            )
        ]
    };
}());
