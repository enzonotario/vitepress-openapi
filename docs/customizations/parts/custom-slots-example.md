<OAOperation operationId="createArtist">

<template #header="header">
<SlotDebugger :slotProps="header" title="header" />
</template>

<template #tags="tags">
<SlotDebugger :slotProps="tags" title="tags" />
</template>

<template #path="path">
<SlotDebugger :slotProps="path" title="path" />
</template>

<template #description="description">
<SlotDebugger :slotProps="description" title="description" />
</template>

<template #security="security">
<SlotDebugger :slotProps="security" title="security" />
</template>

<template #parameters="parameters">
<SlotDebugger :slotProps="parameters" title="parameters" />
</template>

<template #request-body="requestBody">
<SlotDebugger :slotProps="requestBody" title="request-body" />
</template>

<template #responses="responses">
<SlotDebugger :slotProps="responses" title="responses" />
</template>

<template #playground="playground">
<SlotDebugger :slotProps="playground" title="playground" />
</template>

<template #code-samples="codeSamples">
<SlotDebugger :slotProps="codeSamples" title="code-samples" />
</template>

<template #branding="branding">
<SlotDebugger :slotProps="branding" title="branding" />
</template>

<template #footer="footer">
<SlotDebugger :slotProps="footer" title="footer" />
</template>

</OAOperation>
