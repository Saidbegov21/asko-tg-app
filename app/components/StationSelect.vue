<script setup lang="ts">
import { Fuel, Zap } from "lucide-vue-next";

type StationType = "АЗС" | "ЭЗС";

const emit = defineEmits<{
  select: [type: StationType];
}>();
</script>

<template>
  <div class="flex flex-col grow items-center justify-center px-6 py-12 gap-8">

    <AppLogo subtitle="ОСТАВЬТЕ ОТЗЫВ" />

    <div class="flex flex-col gap-5 w-full">
      <div class="text-center">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Выберите тип станции</h2>
        <p class="text-sm text-slate-400 mt-1">Мы подготовим список адресов для вас</p>
      </div>

      <button
        type="button"
        @click="emit('select', 'АЗС')"
        class="flex items-center p-7 border-2 border-slate-100 rounded-4xl bg-white hover:border-red-500 shadow-xl shadow-slate-200/50 transition-all active:scale-95 group cursor-pointer w-full"
      >
        <div class="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
          <Fuel :size="32" :stroke-width="2.5" />
        </div>
        <div class="ml-6 text-left">
          <div class="font-black text-2xl tracking-tight text-slate-900">АЗС</div>
          <div class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Классическое топливо</div>
        </div>
      </button>

      <button
        type="button"
        @click="emit('select', 'ЭЗС')"
        class="flex items-center p-7 border-2 border-slate-100 rounded-4xl bg-white hover:border-blue-500 shadow-xl shadow-slate-200/50 transition-all active:scale-95 group cursor-pointer w-full"
      >
        <div class="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
          <Zap :size="32" :stroke-width="2.5" />
        </div>
        <div class="ml-6 text-left">
          <div class="font-black text-2xl tracking-tight text-slate-900">ЭЗС</div>
          <div class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Электрозарядка</div>
        </div>
      </button>
    </div>

  </div>
</template>