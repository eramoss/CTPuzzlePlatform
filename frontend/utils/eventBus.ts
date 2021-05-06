import Vue from "vue";

const eventBus = new Vue()

export function emitResize() {
    eventBus.$emit('resize')
}

export default eventBus