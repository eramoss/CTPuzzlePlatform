export default class BoxItem {
    category?: string
    itemName?: string
    scores: number[] = [];
    groupNames: string[] = []

    getLabel() {
        return [this.itemName, this.category]
            .filter((it) => it?.length)
            .join(" / ");
    }

    isEquals(boxItem: BoxItem) {
        return boxItem.getLabel() == this.getLabel()
    }

    compareItemNumber(b: BoxItem): number {
        let sortValue = 0
        if (/Item \d+/.test(this.getLabel())) {
            let itemNumberThis = /\d+/.exec(this.getLabel())
            let itemNumberOther = /\d+/.exec(b.getLabel())
            if (itemNumberThis?.length && itemNumberOther?.length) {
                let thisValue = parseFloat(itemNumberThis[0])
                let otherValue = parseFloat(itemNumberOther[0])
                if (thisValue != otherValue) {
                    if (thisValue > otherValue) {
                        sortValue = 1
                    }
                    if (thisValue < otherValue) {
                        sortValue = -1
                    }
                }
            }
        }
        return sortValue
    }

    compareCategory(b: BoxItem, categories: string[]): number {
        let sortValue = 0;
        let thisCategory = this.category;
        let otherCategory = b.category;

        if (thisCategory && otherCategory) {
            const indexThisCategory = categories.indexOf(thisCategory)
            const indexOtherCategory = categories.indexOf(otherCategory)
            if (indexThisCategory > indexOtherCategory) {
                sortValue = 1
            }
            if (indexThisCategory < indexOtherCategory) {
                sortValue = -1
            }
        }

        return sortValue
    }
}