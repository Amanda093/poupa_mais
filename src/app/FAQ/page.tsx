"use client";

import Image from "next/image";
import { useEffect } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Title,
} from "@/components";
import ateriores from "@/components/assets/Anteriores.png";
import botao from "@/components/assets/Botao.png";
import cadastro from "@/components/assets/Cadastro.png";
import campos from "@/components/assets/Campos.png";
import perfil from "@/components/assets/DadosPerfil.png";
import historico from "@/components/assets/historico.png";
import { setTitle } from "@/lib/utils/setTitle";

//Const que contem o codigo da página de FAQ
const FAQPage = () => {
  useEffect(() => {
    setTitle("FAQ");
  });

  return (
    //Divs que contem toda a página
    <div className="pb-[5em]">
      <div className="container mx-auto py-[60px] xl:!max-w-[1270px]">
        {/*Div que contem a explicação sobre o site*/}
        <div className="pb-[2em]">
          <h1 className="max-lg:text-center">
            O que é <b className="text-emerald-500">Poupa +</b>
          </h1>
          <h2 className="pt-[0.5em] text-emerald-500 max-lg:text-center">
            Como utilizar nosso sistema
          </h2>
          <p className="text-light">
            Para utilizar nosso sistema, você deve fornecer algumas informações
            sobre sua situação financeira, como seu salário, o estado em que
            vive e suas principais despesas. Para cada uma das suas despesas, é
            necessário informar o nome da despesa, seu valor e a qual categoria
            ela pertence. Caso deseje adicionar outra despesa, basta clicar no
            botão <kbd>Adicionar despesa</kbd>. Se quiser incluir alguma
            informação extra, escreva-a na área de observações.
          </p>

          <Image
            src={campos}
            alt="Campos do site"
            className="mx-auto my-[1.5em] w-[40em] rounded-[1em] border-[0.15em] border-emerald-500 px-[0.2em]"
          />

          <p className="text-light">
            Depois de adicionar todas as informações desejadas, clique no botão{" "}
            <kbd>Gerar planejamento</kbd> para que nosso sistema gere uma
            sugestão de gestão financeira personalizada para você.
          </p>

          <Image
            src={botao}
            alt="Botão de gerar planejamento"
            className="mx-auto my-[1.5em] w-[15em] rounded-[1em] border-[0.15em] border-emerald-500 px-[0.2em]"
          />

          <h2 className="pt-[0.5em] text-emerald-500 max-lg:text-center">
            Criando uma conta
          </h2>

          <p className="text-light">
            Para criar uma conta, clique no botão <kbd>Login</kbd> na parte
            superior direita do site. Após isso, você será redirecionado para a
            página de cadastro, onde deverá preencher os campos obrigatórios:
            nome, email, data de nascimento, e senha.
          </p>

          <Image
            src={cadastro}
            alt="Cadastro do site"
            className="mx-auto my-[1.5em] w-[40em] rounded-[1em] border-[0.15em] border-emerald-500 px-[0.2em]"
          />

          <p className="text-light">
            Após criar uma conta, você poderá criar até{" "}
            <b className="text-emerald-500">três planejamentos</b> por semana, e
            salva-los em sua conta. Além disso, você poderá utilizar
            planejamentos anteriores para criar novos planejamentos, te ajudando
            a entender melhor o que funciona para você e o que não funciona.
          </p>

          <Image
            src={ateriores}
            alt="Cadastro do site"
            className="mx-auto my-[1.5em] w-[25em] rounded-[1em] border-[0.15em] border-emerald-500 px-[0.2em]"
          />

          <h2 className="pt-[0.5em] text-emerald-500 max-lg:text-center">
            Como ver suas informações
          </h2>
          <p className="text-light">
            Para acessar suas informações, vá até a página de perfil pelo
            cabeçalho do site. Após isso, você verá duas áreas principais:
          </p>
          <p className="text-light">
            A seção de <b className="text-emerald-500">perfil</b>, onde são
            exibidas as informações da sua conta, aqui você pode editar
            informações como nome, email, data de nascimento, senha e depois
            clicar no botão <kbd>Salvar</kbd>. Além disso, você trocar sua foto
            de perfil pelo botão <kbd>Trocar foto</kbd>.
          </p>
          <Image
            src={perfil}
            alt="Área de perfil"
            className="mx-auto my-[1.5em] w-[35em] rounded-[1em] border-[0.15em] border-emerald-500 px-[0.2em]"
          />
          <p className="text-light">
            E o <b className="text-emerald-500">histórico de planejamentos</b>,
            onde é possível visualizar todos os planejamentos feitos
            anteriormente em sua conta.
          </p>
          <Image
            src={historico}
            alt="Histórico de planejamentos"
            className="mx-auto my-[1.5em] w-[40em] rounded-[1em] border-[0.15em] border-emerald-500 px-[0.2em]"
          />
        </div>

        {/*Div com o título de dúvidas frequentes*/}
        <div className="max-lg:text-center">
          <Title mainTitle="Dúvidas" subTitle="Frequentes" />
        </div>

        {/*Accordion com dúvidas respostas*/}
        <Accordion
          type="single"
          collapsible
          className="text-body flex w-full flex-col gap-[35px] rounded-[1em] pb-[1.5em] transition-[height]"
        >
          {/* pergunta 01 */}
          <AccordionItem value="item-1">
            <AccordionTrigger>O que é o Poupa+?</AccordionTrigger>
            <AccordionContent>
              O Poupa+ é um sistema web de auxílio financeiro que ajuda você a
              entender melhor seus gastos mensais e a planejar suas finanças com
              base em sugestões geradas por inteligência artificial.
            </AccordionContent>
          </AccordionItem>

          {/* pergunta 02 */}
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Como o sistema sabe o que sugerir?
            </AccordionTrigger>
            <AccordionContent>
              As sugestões são geradas pela IA Llama, que analisa as despesas
              que você informou e oferece dicas personalizadas para economizar
              ou reorganizar seu orçamento.
            </AccordionContent>
          </AccordionItem>

          {/* pergunta 03 */}
          <AccordionItem value="item-3">
            <AccordionTrigger>O Poupa+ funciona em celular?</AccordionTrigger>
            <AccordionContent>
              Sim! O sistema foi desenvolvido com design responsivo, ou seja,
              funciona tanto em computadores quanto em dispositivos móveis.
            </AccordionContent>
          </AccordionItem>

          {/* pergunta 04 */}
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Posso sugerir melhorias ou relatar bugs?
            </AccordionTrigger>
            <AccordionContent>
              Com certeza! Você pode abrir uma <i>issue</i> no repositório do
              <a
                className="text-bold text-emerald-500 hover:underline"
                href="https://github.com/Amanda093/poupa_mais"
              >
                {" "}
                GitHub
              </a>{" "}
              ou entrar em contato com um dos contribuidores listados no final
              da página.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
export default FAQPage;
