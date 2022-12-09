<div class="h-1 relative rounded-full">
	<div class="absolute left-0 w-full h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500 animation"></div>
</div>

<style>
	.animation {
			animation: load 1s linear infinite;
	}

	@keyframes load {
			from {
					left: -100%;
					width: 100%;
			}
			to {
					left: 100%;
          width: 10%;
			}
  }
</style>