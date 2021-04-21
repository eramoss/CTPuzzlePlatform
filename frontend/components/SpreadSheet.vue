<template>
  <div>
    <client-only v-if="headers">
      <x-grid :columns="columns" :data="data" />
      <vue-table
        v-model="value"
        :custom-options="customOptions"
        :select-position="selectPosition"
        :disable-cells="disableCells"
        :style-wrap-vue-table="styleTable"
        :submenu-thead="submenuHead"
        :submenu-tbody="submenuBody"
        :parent-scroll-element="parentScrollElement"
        :disable-sort-thead="disableSortThead"
        :loading="loading"
        :headers="computedHeaders"
      />
    </client-only>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";

class SpreadSheetHeaderCellStyle {
  width = "200px";
  minWidth = "200px";
  color = "#000";
}

class SpreadSheetHeaderCell {
  headerName!: string;
  headerKey!: string;
  style!: SpreadSheetHeaderCellStyle;
}

@Component({
  components: {
    // https://www.npmjs.com/package/vuejs-spreadsheet
    VueTable: () => import("vuejs-spreadsheet"),
  },
})
export default class SpreadSheet extends Vue {
  @Prop({
    default: () =>
      [
        {
          headerName: "A",
          headerKey: "a",
        },
        {
          headerName: "B",
          headerKey: "b",
        },
        {
          headerName: "C",
          headerKey: "c",
        },
        {
          headerName: "D",
          headerKey: "d",
        },
        {
          headerName: "E",
          headerKey: "e",
        },
        {
          headerName: "F",
          headerKey: "f",
        },
        {
          headerName: "G",
          headerKey: "g",
        },
      ] as SpreadSheetHeaderCell[],
  })
  headers!: SpreadSheetHeaderCell[];

  get computedHeaders() {
    return this.headers.map((header) => {
      if (!header.style) {
        header.style = new SpreadSheetHeaderCellStyle();
      }
      return header;
    });
  }

  columns = [
    {
      text: "",
      type: "button",
      width: "120px",
      buttons: [
        {
          text: "Edit",
          type: "btn-primary",
          onClick: (cell:any, e:any) => {
            console.log(cell, e);
          },
        },
        {
          text: "Delete",
          type: "btn-danger",
          onClick: (cell:any, e:any) => {
            console.log(cell, e);
          },
        },
      ],
    },
    { text: "Name", value: "name", width: "200px", },
    {
      text: "Gender",
      value: "gender_id",
      type: "autocomplete",
      items: [
        { id: 1, name: "Male" },
        { id: 2, name: "Female" },
        { id: 3, name: "Unknown" },
      ],
      itemValue: "id",
      itemText: "name",
    },
    { text: "Age", value: "age", type: "number", },
    { text: "Address", value: "address", width: "400px" },
    { text: "Email", value: "email", },
    { text: "Remarks", value: "remarks" },
  ];

  data = [
    {
      id: 1,
      name: "Juan Tamad",
      gender_id: 1,
      age: 25,
      address: "Bacolod City",
      email: "juan@mail.com",
      remarks: "",
    },
    {
      id: 2,
      name: "Pedro Kinki",
      gender_id: 2,
      age: 25,
      address: "Bacolod City",
      email: "pedro@mail.com",
      remarks: "",
    },
    {
      id: 3,
      name: "San Miguel",
      gender_id: 1,
      age: 25,
      address: "Bacolod City",
      email: "san@mail.com",
      remarks: "",
    },
    {
      id: 3,
      name: "John Doe",
      gender_id: 1,
      age: 25,
      address: "Bacolod City",
      email: "John@mail.com",
      remarks: "",
    },
  ];

  loading = false;
  value = [
    {
      a: {
        type: "img",
        value: "https://via.placeholder.com/350x150",
        active: false,
      },
      c: {
        type: "input",
        value: "Paris",
        active: false,
        style: {
          color: "#000",
        },
      },
      d: {
        type: "input",
        value: "France",
        active: false,
        style: {
          color: "#000",
        },
      },
      e: {
        type: "input",
        value: "Boe",
        active: false,
        style: {
          color: "#000",
        },
      },
      f: {
        type: "select",
        handleSearch: true,
        selectOptions: [
          {
            value: "Harry Potter",
            label: "harry potter",
          },
          {
            value: "Hermione Granger",
            label: "hermione granger",
          },
          {
            value: "Ron Whisley",
            label: "ron whisley",
          },
          {
            value: "Dobby",
            label: "dobby",
          },
          {
            value: "Hagrid",
            label: "hagrid",
          },
          {
            value: "Professeur Rogue",
            label: "professeur rogue",
          },
          {
            value: "Professeur Mcgonagal",
            label: "professeur mcgonagal",
          },
          {
            value: "Professeur Dumbledor",
            label: "professeur dumbledor",
          },
        ],
        value: "professeur dumbledor",
        active: false,
      },
      g: {
        type: "select",
        handleSearch: true,
        selectOptions: [
          {
            value: 1980,
            label: 1980,
          },
          {
            value: 1981,
            label: 1981,
          },
          {
            value: 1982,
            label: 1982,
          },
          {
            value: 1983,
            label: 1983,
            active: true,
          },
          {
            value: 1984,
            label: 1984,
          },
        ],
        value: 1983,
        active: false,
      },
    },
  ];
  submenuHead = [
    {
      type: "button",
      value: "change color",
      function: "change-color",
      disabled: ["a"],
    },
    {
      type: "select",
      disabled: ["a"],
      subtitle: "Select state:",
      selectOptions: [
        {
          value: "new-york",
          label: "new-york",
        },
        {
          value: "france",
          label: "france",
        },
      ],
      value: "new-york",
      buttonOption: {
        value: "change city",
        function: "change-city",
        style: {
          display: "block",
        },
      },
    },
    {
      type: "button",
      value: "change value",
      function: "change-value",
      disabled: ["a", "b"],
    },
  ];
  disableSortThead = ["a", "b", "c"];
  submenuBody = ["a", "b", "c"];
  customOptions = {
    tbodyIndex: true,
    sortHeader: true,
    trad: {
      lang: "pt",
      en: {
        select: {
          placeholder: "Search by typing",
        },
      },
      pt: {
        select: {
          placeholder: "Pesquisar",
        },
      },
    },
    newData: {
      type: "input",
      value: "",
      active: false,
      style: {
        color: "#000",
      },
    },
    fuseOptions: {
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 30,
      maxPatternLength: 64,
      minMatchCharLength: 1,
      findAllMatches: false,
      tokenize: false,
      keys: ["value"],
    },
  };
  disableCells = ["a"];
  selectPosition = {
    top: 0,
    left: 0,
  };
  parentScrollElement = {
    attribute: "html",
    positionTop: 0,
  };
  styleTable = {
    fontSize: "12px",
    comment: {
      borderColor: "#696969",
      borderSize: "8px",
      widthBox: "120px",
      heightBox: "80px",
    },
  };
}
</script>