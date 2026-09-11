import { Html5Qrcode } from "html5-qrcode";

type ConfigCamara = {
  fps: number;
  qrbox: (w: number, h: number) => { width: number; height: number };
  aspectRatio: number;
};

const CONFIG_DEFAULT: ConfigCamara = {
  fps: 10,
  qrbox: (viewfinderWidth, viewfinderHeight) => {
    const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
    const size = Math.max(160, Math.floor(minEdge * 0.72));
    return { width: size, height: size };
  },
  aspectRatio: 1.333,
};

/**
 * Inicia html5-qrcode sobre un nodo ya montado.
 * Prefiere cámara trasera; hace fallback a facingMode / primera cámara.
 */
export async function iniciarCamaraQr(opciones: {
  regionId: string;
  onScan: (decodedText: string) => void;
}): Promise<Html5Qrcode> {
  const { regionId, onScan } = opciones;
  const region = document.getElementById(regionId);
  if (!region) {
    throw new Error("RegionNotFound");
  }

  const scanner = new Html5Qrcode(regionId);
  const camaras = await Html5Qrcode.getCameras();
  if (!camaras.length) {
    throw new Error("DevicesNotFound");
  }

  const trasera =
    camaras.find((c) =>
      /back|rear|traser|environment|posterior/i.test(c.label),
    ) ?? camaras[camaras.length - 1]!;

  const quiet = () => undefined;

  try {
    await scanner.start(trasera.id, CONFIG_DEFAULT, onScan, quiet);
  } catch {
    try {
      await scanner.start(
        { facingMode: "environment" },
        CONFIG_DEFAULT,
        onScan,
        quiet,
      );
    } catch {
      await scanner.start(camaras[0]!.id, CONFIG_DEFAULT, onScan, quiet);
    }
  }

  return scanner;
}

export async function detenerCamaraQr(scanner: Html5Qrcode) {
  try {
    if (scanner.isScanning) {
      await scanner.stop();
    }
  } catch {
    /* ignore */
  }
  try {
    scanner.clear();
  } catch {
    /* ignore */
  }
}

export function mensajeErrorCamaraQr(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/NotAllowedError|Permission|denied/i.test(msg)) {
    return "Permiso de cámara denegado. Habilítalo en el navegador e intenta de nuevo.";
  }
  if (/NotFoundError|no camera|DevicesNotFound|RegionNotFound/i.test(msg)) {
    return "No se detectó una cámara en este dispositivo.";
  }
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "La cámara requiere HTTPS o localhost.";
  }
  return "No se pudo iniciar la cámara. Revisa el permiso e intenta de nuevo.";
}
