// Плеер для управления воспроизведением треков работающий через Web Audio API
export class Player {
    private audioContext: AudioContext; // Звуковой движок браузера
    private gainNode: GainNode; // Узел отвечающий за громкость

    private queue: string[] = []; // Массив ссылок на треки 
    private currentIndex = -1; // Позиция текущего трека в массиве очереди (-1 значит что ничего не выбрано)

    private currentSource: AudioBufferSourceNode | null = null; // Одноразовый узел-источник звука
    private nextSource: AudioBufferSourceNode | null = null; // Следующий одноразовый узел-источник звука
    private nextBuffer: AudioBuffer | null = null; // Раздекодированный следующий трек

    private trackStartTime = 0; // Момент времени когда начал играть текущий трек
    private currentTrackEndTime = 0; // Момент когда текущий трек закончится
    private currentDuration = 0; // Длительность текущего трека в секундах

    constructor() {
        // Здесь строиться базовый аудио-граф – цепочка, по которой будет идти звук
        this.audioContext = new AudioContext(); // Создаём звуковой движок
        this.gainNode = this.audioContext.createGain(); // Создаем узел управления громкостью
        this.gainNode.connect(this.audioContext.destination); // Соединяем узел громкости с "выходом"
    }

    // Создает новый узел-источник
    private createSource(buffer: AudioBuffer): AudioBufferSourceNode {
        const source = this.audioContext.createBufferSource(); // Создает узел-источник
        source.buffer = buffer; // Добавляет декодированные аудио-данные в узел
        source.connect(this.gainNode); // Соединяем узел-источник с узлом управления громкостью
        return source;
    }

    // Делает переход к следующему треку, если текущий подошел к концу
    private advance() {
        if (!this.nextSource || !this.nextBuffer) return;

        this.currentIndex += 1;
        this.currentSource = this.nextSource;
        this.trackStartTime = this.currentTrackEndTime;
        this.currentDuration = this.nextBuffer.duration;
        this.currentTrackEndTime += this.nextBuffer.duration;

        this.currentSource.onended = () => this.advance();
        this.nextSource, this.nextSource = null;
        this.prepareNext();
    }

    // Скачивает и декодирует аудио-файл
    private async loadBuffer(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(arrayBuffer);
    }

    // Подготавливает следующий трек
    private async prepareNext() {
        const nextIndex = this.currentIndex + 1; // Получаем индекс следующего трека
        if (nextIndex >= this.queue.length) return; // Если индекс больше или равен длине, выходим

        const buffer = await this.loadBuffer(this.queue[nextIndex]); // Декодируем следующий трек

        /* 
        Если индекс следующего трека не соответствует индексу текущего трека то выходим
        Проверка на тот случай если по время выполнения получения слудующего трека
        пользователь вручную выберет другой трек
        */
        if (this.currentIndex !== nextIndex - 1) return;

        const source = this.createSource(buffer); // Создаем узел-источник
        source.start(this.currentTrackEndTime); // Устанавливаем момент начала воспроизведения следующего трека

        this.nextSource = source; // Устанавливаем следующий узел-источник
        this.nextBuffer = buffer; // Устанавливаем следующий буфер
    }

    // Запускает воспроизведение трека
    async playAt(index: number) {
        // Если движок находится в состоянии suspended, переводим его в режим resume
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        if (this.currentSource) {
            this.currentSource.onended = null; // Отключаем обработчик события onended, у движка перед остановкой
            this.currentSource.stop(); // Останавливаем генерацию звука
            this.currentSource.disconnect(); // Отключаем узел-источник от графа
        }
        if (this.nextSource) {
            this.nextSource.stop(); // Останавливаем генерацию звука
            this.nextSource.disconnect(); // Отключаем узел-источник от графа
        }
        this.nextBuffer = null; // Очищаем буфер следующего трека

        this.currentIndex = index; // Устанавливаем индекс текущего трека

        const buffer = await this.loadBuffer(this.queue[index]); // Получаем докодированные данные аудио-файла
        const source = this.createSource(buffer); // Создаем узел-источник с декодированными данными

        const startAt = this.audioContext.currentTime; // Получаем текущий момент времени 
        source.start(startAt); // Запускаем генерацию звука

        this.currentSource = source; // Устанавливаем текущий узел-источник
        this.trackStartTime = startAt; // Устанавливаем момент времени когда начал играть текущий трек
        this.currentDuration = buffer.duration; // Устанавливаем длительность текущего трека
        this.currentTrackEndTime = startAt + buffer.duration; // Устанавливаем момент когда текущий трек закончится

        source.onended = () => this.advance(); // Добавляем узлу-источнику обработчик события onended
        this.prepareNext(); // Подготавливаем следующий трек
    }

    // Запускает следующий трек
    async next() {
        const nextIndex = this.currentIndex + 1;
        if (nextIndex < this.queue.length) {
            await this.playAt(nextIndex);
        }
    }

    // Запускает предыдущий трек
    async prev() {
        const prevIndex = this.currentIndex - 1;
        if (prevIndex >= 0) {
            await this.playAt(prevIndex);
        }
    }

    // Переходит к определенному моменту трека
    seek(time: number) {
        if (!this.currentSource || !this.currentSource.buffer) return;

        const buffer = this.currentSource.buffer;
        const clampedTime = Math.max(0, Math.min(time, buffer.duration)); // Приводит time к 0 или к длительности трека, если оно выходит за пределы этих значений

        this.currentSource.onended = null; // Убираем обработчик события onended у текущего узла-источника 
        this.currentSource.stop(); // Останавливаем текущий узел-источник

        const newSource = this.createSource(buffer);
        const startAt = this.audioContext.currentTime;
        newSource.start(startAt, clampedTime);

        this.currentSource = newSource; 
        this.trackStartTime = startAt - clampedTime;
        this.currentTrackEndTime = this.trackStartTime + buffer.duration;
        this.currentSource.onended = () => this.advance();

        this.nextSource?.stop();
        this.nextSource, this.nextBuffer = null;
        this.prepareNext();
    }

    pause() {
        this.audioContext.suspend();
    }

    resume() {
        this.audioContext.resume();
    }

    hasNext(): boolean {
        return this.currentIndex + 1 < this.queue.length;
    }

    hasPrev(): boolean {
        return this.currentIndex - 1 >= 0;
    }

    setQueue(urls: string[]) {
        this.queue = urls;
    }

    setVolume(value: number) {
        this.gainNode.gain.value = value;
    }

    getVolume(): number {
        return this.gainNode.gain.value;
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }

    getCurrentTime(): number {
        return this.audioContext.currentTime - this.trackStartTime;
    }

    getDuration(): number {
        return this.currentDuration;
    }
}